import {
  Body,
  Controller,
  ForbiddenException,
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
import { LoggedInUser, User, UserRole } from 'src/users/entities/user.entity';
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
import { Public } from 'src/auth/jwt-auth.guard';
import { CreateCustomerCustomerDto } from './dto/create-customer-customer.dto';
import { Roles } from 'src/auth/roles.decorator';
import { UsersService } from 'src/users/users.service';
import { use } from 'passport';
import { CreateCustomerUserDto } from './dto/create-customer-user.dto';

@ApiTags('Customers')
@Controller('customers')
@ApiBearerAuth()
export class CustomersController {
  constructor(
    private readonly customersService: CustomersService,
    private readonly usersService: UsersService,
  ) {}

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

  @Post('/customer')
  @Public()
  @ApiOperation({ summary: 'Khách hàng tự nhập thông tin' })
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
        serialNumber: { type: 'string', description: 'Mã S/N' },
        addess: {
          type: 'string',
          description: 'Số nhà, tên đường, tổ/ấp/thôn,....',
        },
        idCardNumber: { type: 'string', description: 'Số CMND/CCCD' },
        datePurchase: {
          type: 'date',
          description: 'Ngày mua fomart `YYYY-MM-DD`',
        },
        seriesPurchase: { type: 'string', description: 'Dòng máy' },
        email: { type: 'string' },
        provinceId: { type: 'int' },
        districtId: { type: 'int' },
        wardId: { type: 'int' },
        fileSN: {
          type: 'string',
          format: 'binary',
          description: 'Hình chụp mã S/N',
        },
        fileReceipt: {
          type: 'string',
          format: 'binary',
          description: 'Hình chụp hóa đơn',
        },
      },
    },
  })
  async createCustomer(
    @Body() createCustomerDto: CreateCustomerCustomerDto,
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
    createCustomerDto.type = 'customer';
    return this.customersService.create(createCustomerDto, user);
  }

  @Get()
  findAll(@Query() input: CustomerFilter, @CurrentUser() user: LoggedInUser) {
    switch (user.role) {
      case UserRole.SA:
      case UserRole.ADMIN:
        break;
      case UserRole.HOTLINE:
        input.type = 'customer';
        break;
      case UserRole.USER:
      default:
        throw new ForbiddenException();
    }
    return this.customersService.findAllWithFilter(input);
  }

  @Get('/:id')
  findDetail(@Param('id') id: number) {
    return this.customersService.detail(id);
  }

  @Patch('/:id')
  @Roles(...[UserRole.ADMIN, UserRole.HOTLINE, UserRole.SA])
  @ApiOperation({ summary: 'Sửa thông tin khách hàng' })
  @ApiBody({
    schema: {
      type: 'object',
      required: [
        'name',
        'serialNumber',
        'email',
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
        reason: { type: 'string', description: 'Lý do chỉnh sửa' },
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
  @Roles(...[UserRole.ADMIN, UserRole.HOTLINE, UserRole.SA])
  confirm(@CurrentUser() user: LoggedInUser, @Param('id') id: number) {
    return this.customersService.confirm(id, user);
  }

  @Post('/reject/:id')
  @Roles(...[UserRole.ADMIN, UserRole.HOTLINE, UserRole.SA])
  reject(
    @CurrentUser() user: LoggedInUser,
    @Param('id') id: number,
    @Body() input: RejectDto,
  ) {
    return this.customersService.reject(id, input.reason, user);
  }

  @Post('/user')
  @Roles(...[UserRole.USER, UserRole.SA, UserRole.ADMIN])
  @ApiOperation({ summary: 'User tại outlet nhập thông tin khách hàng' })
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
        'fileSN',
        'fileReceipt',
        'idCardNumber',
        'datePurchase',
        'seriesPurchase',
      ],
      properties: {
        name: { type: 'string' },
        phone: { type: 'string' },
        serialNumber: { type: 'string' },
        idCardNumber: { type: 'string' },
        datePurchase: { type: 'date' },
        seriesPurchase: { type: 'string' },
        email: { type: 'string' },
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
  async createCustomerUser(
    @Body() createCustomerDto: CreateCustomerUserDto,
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
    createCustomerDto.type = 'user';
    const userEntity = await this.usersService.findOne({
      where: { id: user.id },
    });
    createCustomerDto.provinceId = userEntity.provinceId;
    createCustomerDto.districtId = userEntity.districtId;
    createCustomerDto.wardId = userEntity.wardId;
    createCustomerDto.address = userEntity.address;

    return this.customersService.create(createCustomerDto, user);
  }
}
