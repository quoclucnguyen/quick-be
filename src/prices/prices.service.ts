import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AbstractService } from 'src/common/abstract.service';
import { DataSource, Repository } from 'typeorm';
import { PriceEntity } from './entities/price.entity';

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
    return this.repository.save(priceEntity);
  }
}
