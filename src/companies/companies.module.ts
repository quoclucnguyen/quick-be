import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompaniesService } from './companies.service';
import { CompaniesController } from './companies.controller';
import { CompanyEntity } from './entities/company.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([CompanyEntity]),
  ],
  providers: [
    CompaniesService,
    CompaniesController,
  ],
  exports: [
    CompaniesService,
  ],
  controllers:[
     CompaniesController,
  ]
})
export class CompaniesModule {
}
