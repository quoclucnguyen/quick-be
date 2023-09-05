// protected region Add additional imports here on begin
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
import { UploadsModule } from './uploads/uploads.module';
// protected region Add additional imports here end

// protected region Add other code in here on begin
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
  LOG_REQUESTS: Joi.boolean().default(true),
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
    UploadsModule,
    // protected region Add other code in here end

    // protected region Add end code in here on begin
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
  constructor(private configService: ConfigService) {}

  configure(consumer: MiddlewareConsumer) {
    if (this.configService.get<boolean>('LOG_REQUESTS')) {
      consumer.apply(LoggerMiddleware).forRoutes('*');
    }
  }
}
// protected region Add end code in here end
