import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsOrder, FindOptionsWhere, Like, Repository } from 'typeorm';
import { AbstractService } from 'src/common/abstract.service';
import { LoggedInUser } from 'src/users/entities/user.entity';
import { CompanyEntity } from './entities/company.entity';
import { FilterCompanyDto } from './dto/filter-company.dto';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { ImportCompanyDto } from './dto/import-company.dto';

@Injectable()
export class CompaniesService extends AbstractService<CompanyEntity> {
  constructor(
    @InjectRepository(CompanyEntity)
    repository: Repository<CompanyEntity>,
  ) {
    super(CompaniesService.name, repository);
  }

  /**
   * Finds all entities that match the given filter criteria.
   * @param {FilterCompanyDto} filter - The filter criteria to apply.
   * @param {LoggedInUser} loggedInUser - The user performing the search.
   * @returns {Promise<{ entities: CompanyEntity[], count: number }>} An object containing the matching entities and the total count.
   */
  async findAllWithFilter(
    filter: FilterCompanyDto,
    loggedInUser: LoggedInUser
  ): Promise<{ entities: CompanyEntity[], count: number }> {
    const {
      take, 
      skip,
      name,
      code,
    } = filter;
    const whereClause: FindOptionsWhere<CompanyEntity> = {
      isActive: true,
      name: Like(filter?.name ? `%${filter.name}%` : '%%'),
      code: Like(filter?.code ? `%${filter.code}%` : '%%'),
    };
    const orderClause: FindOptionsOrder<CompanyEntity> = {
      id: 'DESC',
    };

    const [entities, count] = await this.repository.findAndCount({
      take,
      skip,
      where: whereClause,
      order: orderClause,
    });

    return {
      entities,
      count,
    };
  }

  /**
   * Creates a new company in the repository.
   * @param {CreateCompanyDto} input - The details of the company to create.
   * @param {LoggedInUser} loggedInUser - The user who is creating the company.
   * @returns {Promise<CompanyEntity>} The newly created company.
  **/
  async create(input: CreateCompanyDto, loggedInUser: LoggedInUser): Promise<CompanyEntity> {
    const company = this.repository.create(input);
    company.createdBy = loggedInUser.id;
    return this.repository.save(company);
  }

  /**
   * Updates a company entity in the database
   * @param {CompanyEntity} company - The company entity to be updated
   * @param {UpdateCompanyDto} input - The updated company data
   * @param {LoggedInUser} loggedInUser - The logged in user making the update
   * @returns The updated company entity
   */
  async updateCompany(company: CompanyEntity, input: UpdateCompanyDto, loggedInUser: LoggedInUser) : Promise<CompanyEntity> {
    const { 
      name,
      code,
    } = input;
    if (name) {
      company.name = name;
    }
    if (code) {
      company.code = code;
    }
    company.updatedBy = loggedInUser.id;
    return this.repository.save(company);
  }

  /**
   * Imports a company with the given data and sets createdBy to the user's ID.
   * @param {ImportCompanyDto} companyData - The data of the company to import.
   * @param {LoggedInUser} user - The user importing the company.
   * @returns {Promise<boolean>} - Whether the import was successful.
   */
  async importCompany(companyData: ImportCompanyDto, user: LoggedInUser): Promise<boolean> {
    const dataToSave = companyData.data.map((item) => {
      return {
        ...item,
        createdBy: user.id,
      };
    });
    const savedData = await this.repository.save(dataToSave);
    return savedData.length === companyData.data.length;
  }
}
