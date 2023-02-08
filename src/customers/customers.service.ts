import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AbstractService } from 'src/common/abstract.service';
import { Repository } from 'typeorm';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { CustomerEntity } from './entities/customer.entity';

@Injectable()
export class CustomersService extends AbstractService<CustomerEntity> {
  constructor(
    @InjectRepository(CustomerEntity)
    repository: Repository<CustomerEntity>
  ) {
    super(CustomersService.name, repository);
  }
  create(createCustomerDto: CreateCustomerDto) {
    return 'This action adds a new customer';
  }

  remove(id: number) {
    return `This action removes a #${id} customer`;
  }

  async checkPhone(phone: string) {
    const customer = await this.repository.findOne({
      select: {
        id: true
      },
      where: {
        phone: phone,
        isActive: true,
      }
    });
    if (customer) {
      return {
        success: false,
        message: 'Số điện thoại đã được nhận sampling.'
      };
    }
    return {
      success: true,
      message: null
    };
  }
}
