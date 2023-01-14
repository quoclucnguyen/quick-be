import { Module } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { CustomersController } from './customers.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerEntity } from './entities/customer.entity';
import { ImagesModule } from 'src/images/images.module';
import { GiftsModule } from 'src/gifts/gifts.module';
import { CustomerHistoryEntity } from './entities/customer-history.entity';
import { CustomerActionHistoryEntity } from './entities/customer-action-history.entity';
import { UsersModule } from 'src/users/users.module';

@Module({
  controllers: [CustomersController],
  providers: [CustomersService],
  imports: [
    TypeOrmModule.forFeature([
      CustomerEntity,
      CustomerHistoryEntity,
      CustomerActionHistoryEntity,
    ]),
    ImagesModule,
    GiftsModule,
    UsersModule
  ],
})
export class CustomersModule { }
