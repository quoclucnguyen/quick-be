import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CurrentUser } from 'src/auth/curent-user.decorator';
import { LoggedInUser } from 'src/users/entities/user.entity';
import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { CustomerEntity } from './entities/customer.entity';

@ApiTags('Customers')
@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}
  @Post()
  async create(
    @Body() createCustomerDto: CreateCustomerDto,
    @CurrentUser() user: LoggedInUser,
  ): Promise<CustomerEntity> {
    return this.customersService.create(createCustomerDto, user);
  }

  @Get()
  findAll() {
    return this.customersService.findAll();
  }
}
