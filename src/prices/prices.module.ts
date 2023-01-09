import { Module } from '@nestjs/common';
import { PricesService } from './prices.service';
import { PricesController } from './prices.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PriceEntity } from './entities/price.entity';

@Module({
  controllers: [PricesController],
  providers: [PricesService],
  imports: [TypeOrmModule.forFeature([PriceEntity])],
})
export class PricesModule {}
