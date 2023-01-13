import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
  ValidationPipe,
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
import {
  FileFieldsInterceptor,
  FileInterceptor,
} from '@nestjs/platform-express';
import { CustomerFilter } from './dto/customer.filter';
import { EditCustomerDto } from './dto/edit-customer.dto';
import { GiftEntity } from 'src/gifts/entities/gift.entity';
import { RejectDto } from './dto/reject.dto';

@ApiTags('Customers')
@Controller('customers')
@ApiBearerAuth()
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}
  @Post()
  @ApiOperation({ summary: 'Nhập thông tin khách hàng' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'fileSN', maxCount: 1 },
      { name: 'fileReceipt', maxCount: 1 },
    ]),
  )
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
    @UploadedFiles()
    files: {
      fileSN: Express.Multer.File[];
      fileReceipt: Express.Multer.File[];
    },
    @CurrentUser() user: LoggedInUser,
  ) {
    const { fileSN, fileReceipt } = files;
    createCustomerDto.fileSN = fileSN[0];
    createCustomerDto.fileRecipt = fileReceipt[0];
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
  @ApiOperation({ summary: 'Sửa thông tin khách hàng' })
  @ApiBody({
    schema: {
      type: 'object',
      required: [
        'name',
        'serialNumber',
        'email',
        'provinceId',
        'districtId',
        'wardId',
        'idCardNumber',
        'datePurchase',
        'seriesPurchase',
        'reason',
      ],
      properties: {
        name: { type: 'string' },
        serialNumber: { type: 'string' },
        address: { type: 'string' },
        idCardNumber: { type: 'string' },
        datePurchase: { type: 'string', format: 'date-time' },
        seriesPurchase: { type: 'string' },
        reason: { type: 'string' },
        email: { type: 'string' },
        provinceId: { type: 'number' },
        districtId: { type: 'number' },
        wardId: { type: 'number' },
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
    return this.customersService.confirm(id, user);
  }

  @Post('/reject/:id')
  reject(
    @CurrentUser() user: LoggedInUser,
    @Param('id') id: number,
    @Body() input: RejectDto,
  ) {
    return this.customersService.reject(id, input.reason, user);
  }
}
