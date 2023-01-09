import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AbstractService } from 'src/common/abstract.service';
import { PriceEntity } from 'src/prices/entities/price.entity';
import { PricesService } from 'src/prices/prices.service';
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
    @InjectRepository(PriceEntity)
    private readonly priceRepository: Repository<PriceEntity>,
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

  async createCustomerFromName(name: string): Promise<CustomerEntity> {
    const priceEntity = await this.priceRepository
      .createQueryBuilder()
      .orderBy('RAND()')
      .getOne();

    const customer = new CustomerEntity();
    customer.customerName = name;
    customer.price = priceEntity;
    return this.repository.save(customer);
  }
}
