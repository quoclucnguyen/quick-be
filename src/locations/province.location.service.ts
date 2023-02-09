import { InjectRepository } from '@nestjs/typeorm';
import { AbstractService } from 'src/common/abstract.service';
import { Repository } from 'typeorm';
import { Province } from './entities/province.entity';

export class ProvinceLocationService extends AbstractService<Province> {
  constructor(
    @InjectRepository(Province)
    repository: Repository<Province>,
  ) {
    super(ProvinceLocationService.name, repository);
  }

  async findAllWithoutCondition() {
    return await this.repository.find();
  }
}
