import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AbstractService } from 'src/common/abstract.service';
import { DataSource, Repository } from 'typeorm';
import { PriceEntity } from './entities/price.entity';
import { faker } from '@faker-js/faker';

@Injectable()
export class PricesService extends AbstractService<PriceEntity> {
  constructor(
    @InjectRepository(PriceEntity)
    repository: Repository<PriceEntity>,
    private dataSource: DataSource,
  ) {
    super(PricesService.name, repository);
  }
  async generateAndInsertPriceEntity(): Promise<PriceEntity> {
    const priceEntity = new PriceEntity();
    priceEntity.name = faker.commerce.productName();
    priceEntity.code = faker.random.alphaNumeric(10);
    priceEntity.imageUrl = faker.image.imageUrl();
    return this.repository.save(priceEntity);
  }
}
