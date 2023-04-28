import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from "@nestjs/common";
import { CompanyEntity } from "../entities/company.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Injectable()
export class CompanyByIdPipe implements PipeTransform<number, Promise<CompanyEntity>>{
  constructor(
    @InjectRepository(CompanyEntity)
    private companiesRepository: Repository<CompanyEntity>,
  ) { }

  async transform(id: number) {
    const company = await this.companiesRepository.findOneBy({ id });
    if (!company) {
      throw new BadRequestException('Company not exits');
    }
    return company;
  }

}