import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PricesService } from './prices.service';

@ApiTags('Prices')
@Controller('prices')
export class PricesController {
  constructor(private readonly pricesService: PricesService) {}

  @Get('/generate')
  gemerate() {
    return this.pricesService.generateAndInsertPriceEntity();
  }

  @Get()
  findAll() {
    return this.pricesService.findAll();
  }
}
