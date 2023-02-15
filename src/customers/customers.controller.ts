import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFiles,
  Query,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentUser } from 'src/auth/curent-user.decorator';
import { LoggedInUser } from 'src/users/entities/user.entity';
import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { EditCustomerDto } from './dto/edit-customer.dto';
import { FilterCustomerDto } from './dto/filter-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';

@ApiBearerAuth()
@ApiTags('Customers')
@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @UseInterceptors(FileFieldsInterceptor([{ name: 'files', maxCount: 3 }]))
  @ApiOperation({ summary: 'Thông tin nhập liệu' })
  @ApiConsumes('multipart/form-data')
  @Post()
  create(
    @Body() createCustomerDto: CreateCustomerDto,
    @UploadedFiles()
    files: {
      files: Express.Multer.File[];
    },
    @CurrentUser() user: LoggedInUser,
  ) {
    createCustomerDto.files = files.files;
    return this.customersService.create(createCustomerDto, user);
  }

  @UseInterceptors(FileFieldsInterceptor([{ name: 'files', maxCount: 3 }]))
  @ApiOperation({ summary: 'Thông tin nhập liệu edit' })
  @ApiConsumes('multipart/form-data')
  @Post('/edit')
  edit(
    @Body() input: EditCustomerDto,
    @UploadedFiles()
    files: {
      files: Express.Multer.File[];
    },
    @CurrentUser() user: LoggedInUser,
  ) {
    input.files = files.files;
    return this.customersService.create(input, user, input.time);
  }

  @Get()
  findAll(@Query() filter: FilterCustomerDto) {
    return this.customersService.findAllWithFilter(filter);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {}

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCustomerDto: UpdateCustomerDto,
  ) {}

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.customersService.remove(+id);
  }

  @Post('check-phone')
  checkPhone(@Body() input: { phone: string }) {
    return this.customersService.checkPhone(input.phone);
  }

  @Post('check-otp')
  checkOtp(@Body() input: { otp: string }) {
    return this.customersService.checkOtp(input.otp);
  }
}
