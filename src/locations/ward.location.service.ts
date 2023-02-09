import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AbstractService } from 'src/common/abstract.service';
import { Repository } from 'typeorm';
import { Ward } from './entities/ward.entity';

@Injectable()
export class WardLocationService extends AbstractService<Ward> {
  constructor(
    @InjectRepository(Ward)
    repository: Repository<Ward>,
  ) {
    super(WardLocationService.name, repository);
  }

  async findAllWithoutCondition() {
    return await this.repository.find();
  }
}
