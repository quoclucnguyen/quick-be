
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentUser } from 'src/auth/curent-user.decorator';
import { LoggedInUser } from 'src/users/entities/user.entity';
import { CompaniesService } from './companies.service';
import { FilterCompanyDto } from './dto/filter-company.dto';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { ImportCompanyDto } from './dto/import-company.dto';
import { CompanyEntity } from './entities/company.entity';
import { CompanyByIdPipe } from './pipes/company-by-id.pipe';


@ApiBearerAuth()
@ApiTags('Companies')
@Controller('companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Get()
  findAll(
    @Query() filter: FilterCompanyDto,
    @CurrentUser() user: LoggedInUser
    ) {
    return this.companiesService.findAllWithFilter(filter, user);
  }

  @Post()
  create(
    @Body() createCompanyDto: CreateCompanyDto,
    @CurrentUser() user: LoggedInUser,
  ) {
    return this.companiesService.create(createCompanyDto, user);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe, CompanyByIdPipe) company: CompanyEntity,
    @Body() updateCompanyDto: UpdateCompanyDto,
    @CurrentUser() user: LoggedInUser,
  ) {
    return this.companiesService.updateCompany(company, updateCompanyDto, user);
  }

  @Delete(':id')
  delete(
    @Param('id') id: string,
  ){
    return this.companiesService.removeWithOpts({where:{id: +id}});
  }

  @Post('import')
  import(
    @CurrentUser() user: LoggedInUser,
    @Body() importCompanyDto: ImportCompanyDto,
  ){
    return this.companiesService.importCompany(importCompanyDto, user);
  }
}