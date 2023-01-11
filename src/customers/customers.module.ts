import { Module } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { CustomersController } from './customers.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerEntity } from './entities/customer.entity';
import { ImagesModule } from 'src/images/images.module';
import { GiftsModule } from 'src/gifts/gifts.module';

@Module({
  controllers: [CustomersController],
  providers: [CustomersService],
  imports: [
    TypeOrmModule.forFeature([CustomerEntity]),
    ImagesModule,
    GiftsModule,
  ],
})
export class CustomersModule {}
