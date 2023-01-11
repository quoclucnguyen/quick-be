import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AbstractService } from 'src/common/abstract.service';
import { Repository } from 'typeorm';
import { District } from './entities/district.entity';

@Injectable()
export class DistrictLocationService extends AbstractService<District> {
  constructor(
    @InjectRepository(District)
    repository: Repository<District>,
  ) {
    super(DistrictLocationService.name, repository);
  }

  async findAllWithoutCondition() {
    return await this.repository.find();
  }
}
