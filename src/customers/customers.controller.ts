import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
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
import { CustomerFilter } from './dto/customer.filter';
import { EditCustomerDto } from './dto/edit-customer.dto';

@ApiTags('Customers')
@Controller('customers')
@ApiBearerAuth()
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}
  @Post()
  @ApiOperation({ summary: 'Nhập thông tin khách hàng' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('fileSN'))
  @UseInterceptors(FileInterceptor('fileReceipt'))
  @ApiBody({
    schema: {
      type: 'object',
      required: [
        'name',
        'phone',
        'serialNumber',
        'email',
        'type',
        'fileSN',
        'fileReceipt',
        'provinceId',
        'districtId',
        'wardId',
        'idCardNumber',
        'datePurchase',
        'seriesPurchase',
      ],
      properties: {
        name: { type: 'string' },
        phone: { type: 'string' },
        serialNumber: { type: 'string' },
        addess: { type: 'string' },
        idCardNumber: { type: 'string' },
        datePurchase: { type: 'date' },
        seriesPurchase: { type: 'string' },
        email: { type: 'string' },
        provinceId: { type: 'int' },
        districtId: { type: 'int' },
        wardId: { type: 'int' },
        type: {
          type: 'enum',
          enum: ['customer', 'user'],
        },
        fileSN: {
          type: 'string',
          format: 'binary',
        },
        fileReceipt: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  async create(
    @Body() createCustomerDto: CreateCustomerDto,
    @UploadedFile() fileSN: Express.Multer.File,
    @UploadedFile() fileReceipt: Express.Multer.File,
    @CurrentUser() user: LoggedInUser,
  ): Promise<CustomerEntity> {
    createCustomerDto.fileSN = fileSN;
    createCustomerDto.fileRecipt = fileReceipt;
    return this.customersService.create(createCustomerDto, user);
  }

  @Get()
  findAll(@Query() input: CustomerFilter, @CurrentUser() user: LoggedInUser) {
    return this.customersService.findAllWithFilter(input);
  }

  @Get('/:id')
  findDetail(@Param('id') id: number) {
    return this.customersService.detail(id);
  }

  @Patch('/:id')
  @ApiOperation({ summary: 'Nhập thông tin khách hàng' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('fileSN'))
  @UseInterceptors(FileInterceptor('fileReceipt'))
  @ApiBody({
    schema: {
      type: 'object',
      required: [
        'name',
        'phone',
        'serialNumber',
        'email',
        'provinceId',
        'districtId',
        'wardId',
        'idCardNumber',
        'datePurchase',
        'seriesPurchase',
      ],
      properties: {
        name: { type: 'string' },
        phone: { type: 'string' },
        serialNumber: { type: 'string' },
        addess: { type: 'string' },
        idCardNumber: { type: 'string' },
        datePurchase: { type: 'date' },
        seriesPurchase: { type: 'string' },
        email: { type: 'string' },
        provinceId: { type: 'int' },
        districtId: { type: 'int' },
        wardId: { type: 'int' },
      },
    },
  })
  update(
    @Param('id') id: number,
    @Body() input: EditCustomerDto,
    @CurrentUser() user: LoggedInUser,
  ) {
    return this.customersService.edit(id, input, user);
  }

  @Get('/confirm/:id')
  confirm(@CurrentUser() user: LoggedInUser, @Param('id') id: number) {
    
  }
}
