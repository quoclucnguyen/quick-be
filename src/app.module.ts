import {
  ClassSerializerInterceptor,
  MiddlewareConsumer,
  Module,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import * as Joi from 'joi';
import { join } from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { LoggerOptions } from 'typeorm';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { RolesGuard } from './auth/roles.guard';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import 'winston-daily-rotate-file';
import { LoggerMiddleware } from './common/logger.middleware';
import { ProjectsModule } from './projects/projects.module';
import { GiftsModule } from './gifts/gifts.module';
import { UploadsModule } from './uploads/uploads.module';
import { CustomersModule } from './customers/customers.module';
import { LocationsModule } from './locations/locations.module';
import { ImagesModule } from './images/images.module';
import { GoogleRecaptchaModule } from '@nestlab/google-recaptcha';
import { IncomingMessage } from 'http';

const configSchema = Joi.object({
  APP_PORT: Joi.number().default(3000),
  APP_LOG_LEVELS: Joi.array()
    .has(
      Joi.string()
        .valid('error', 'warn', 'debug', 'log', 'verbose')
        .default('log'),
    )
    .unique(),
  DATABASE_TYPE: Joi.string().default('mysql'),
  DATABASE_HOST: Joi.string().default('localhost'),
  DATABASE_PORT: Joi.number().default(3306),
  DATABASE_USERNAME: Joi.string().required(),
  DATABASE_PASSWORD: Joi.string().default(''),
  DATABASE_NAME: Joi.string().required(),
  DATABASE_SYNC: Joi.boolean().default(false),
  DATABASE_LOG_LEVELS: Joi.alt(
    Joi.boolean(),
    Joi.string().valid('all'),
    Joi.array()
      .has(
        Joi.string().valid('query', 'error', 'schema', 'warn', 'info', 'log'),
      )
      .unique(),
  ).default(true),
  JWT_SECRET: Joi.string().required(),
  JWT_EXPIRES: Joi.string().required(),
  SA_PASSWORD: Joi.string().required(),
  RECAPTCHA_SECRET_KEY: Joi.string().required(),
  CUSTOMER_ACTION_NAME: Joi.string().required(),
  ENV: Joi.string().valid('dev', 'prod').required(),
});

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
      serveStaticOptions: {
        setHeaders(res, path, stat) {
          res.set('Access-Control-Allow-Origin', '*');
          res.set(
            'Access-Control-Allow-Methods',
            'GET,HEAD,PUT,PATCH,POST,DELETE',
          );
        },
      },
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: configSchema,
      envFilePath: ['.env.local', '.env.development'],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService): TypeOrmModuleOptions => ({
        type: configService.get<string>('DATABASE_TYPE') as any,
        host: configService.get<string>('DATABASE_HOST'),
        port: configService.get<number>('DATABASE_PORT'),
        username: configService.get<string>('DATABASE_USERNAME'),
        password: configService.get<string>('DATABASE_PASSWORD'),
        database: configService.get<string>('DATABASE_NAME'),
        synchronize: configService.get<boolean>('DATABASE_SYNC'),
        logging: configService.get<LoggerOptions>('DATABASE_LOG_LEVELS'),
        autoLoadEntities: true,
        entities: ['dist/*/entities/*.js'],
      }),
    }),
    WinstonModule.forRoot({
      transports: [
        new winston.transports.DailyRotateFile({
          filename: 'logs/%DATE%.log',
          datePattern: 'YYYY_MM_DD',
          zippedArchive: true,
        }),
        new winston.transports.Console(),
      ],
    }),
    UsersModule,
    AuthModule,
    ProjectsModule,
    GiftsModule,
    UploadsModule,
    CustomersModule,
    LocationsModule,
    ImagesModule,
    GoogleRecaptchaModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secretKey: configService.get<string>('RECAPTCHA_SECRET_KEY'),
        actions: [configService.get<string>('CUSTOMER_ACTION_NAME')],
        score: 0.8,
        response: (req: IncomingMessage) =>
          (req.headers.recaptcha || '').toString(),
      }),
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
