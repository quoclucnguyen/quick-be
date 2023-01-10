import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AbstractService } from 'src/common/abstract.service';
import { LoggedInUser } from 'src/users/entities/user.entity';
import { DataSource, Repository } from 'typeorm';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { CustomerEntity } from './entities/customer.entity';

@Injectable()
export class CustomersService extends AbstractService<CustomerEntity> {
  constructor(
    @InjectRepository(CustomerEntity)
    repository: Repository<CustomerEntity>,
    private dataSource: DataSource,
  ) {
    super(CustomersService.name, repository);
  }
  async create(
    createCustomerDto: CreateCustomerDto,
    user: LoggedInUser,
  ): Promise<CustomerEntity> {
    const customer = this.repository.create(createCustomerDto);
    customer.createdBy = user.id;
    
    return this.repository.save(customer);
  }

}
