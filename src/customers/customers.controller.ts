import {
  Body,
  Controller,
  Get,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentUser } from 'src/auth/curent-user.decorator';
import { LoggedInUser } from 'src/users/entities/user.entity';
import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { CustomerEntity } from './entities/customer.entity';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('Customers')
@Controller('customers')
@ApiBearerAuth()
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}
  @Post()
  @ApiOperation({ summary: 'Nhập thông tin khách hàng' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  @ApiBody({
    schema: {
      type: 'object',
      required: [
        'name',
        'phone',
        'serialNumber',
        'email',
        'type',
        'file',
        'provine_id',
        'district_id',
        'ward_id',
      ],
      properties: {
        name: { type: 'string' },
        phone: { type: 'string' },
        serialNumber: { type: 'string' },
        addess: { type: 'string' },
        email: { type: 'string' },
        provinceId: { type: 'int' },
        districtId: { type: 'int' },
        wardId: { type: 'int' },
        type: {
          type: 'enum',
          enum: ['customer', 'user'],
        },
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  async create(
    @Body() createCustomerDto: CreateCustomerDto,
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() user: LoggedInUser,
  ): Promise<CustomerEntity> {
    createCustomerDto.file = file;
    return this.customersService.create(createCustomerDto, user);
  }

  @Get()
  findAll() {
    return this.customersService.findAll();
  }
}
