import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsOrder, FindOptionsWhere, Like, Repository } from 'typeorm';
import { AbstractService } from 'src/common/abstract.service';
import { LoggedInUser } from 'src/users/entities/user.entity';
import { AuthorEntity } from './entities/author.entity';
import { FilterAuthorDto } from './dto/filter-author.dto';
import { CreateAuthorDto } from './dto/create-author.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';
import { ImportAuthorDto } from './dto/import-author.dto';

@Injectable()
export class AuthorsService extends AbstractService<AuthorEntity> {
  constructor(
    @InjectRepository(AuthorEntity)
    repository: Repository<AuthorEntity>,
  ) {
    super(AuthorsService.name, repository);
  }

  /**
   * Finds all entities that match the given filter criteria.
   * @param {FilterAuthorDto} filter - The filter criteria to apply.
   * @param {LoggedInUser} loggedInUser - The user performing the search.
   * @returns {Promise<{ entities: AuthorEntity[], count: number }>} An object containing the matching entities and the total count.
   */
  async findAllWithFilter(
    filter: FilterAuthorDto,
    loggedInUser: LoggedInUser
  ): Promise<{ entities: AuthorEntity[], count: number }> {
    const {
      take, 
      skip,
        name,
        code,
        address,
        ageNumber,
        countTime,
    } = filter;
    const whereClause: FindOptionsWhere<AuthorEntity> = {
      isActive: true,
          name: Like(filter?.name ? `%${filter.name}%` : '%%'),
          code: Like(filter?.code ? `%${filter.code}%` : '%%'),
          address: Like(filter?.address ? `%${filter.address}%` : '%%'),
          ageNumber: filter?.ageNumber ?? null,
          countTime: filter?.countTime ?? null,
    };
    const orderClause: FindOptionsOrder<AuthorEntity> = {
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
   * Creates a new author in the repository.
   * @param {CreateAuthorDto} input - The details of the author to create.
   * @param {LoggedInUser} loggedInUser - The user who is creating the author.
   * @returns {Promise<AuthorEntity>} The newly created author.
  **/
  async create(input: CreateAuthorDto, loggedInUser: LoggedInUser): Promise<AuthorEntity> {
    const author = this.repository.create(input);
    author.createdBy = loggedInUser.id;
    return this.repository.save(author);
  }

  /**
   * Updates a author entity in the database
   * @param {AuthorEntity} author - The author entity to be updated
   * @param {UpdateAuthorDto} input - The updated author data
   * @param {LoggedInUser} loggedInUser - The logged in user making the update
   * @returns The updated author entity
   */
  async updateAuthor(author: AuthorEntity, input: UpdateAuthorDto, loggedInUser: LoggedInUser) : Promise<AuthorEntity> {
    const { name, code, address } = input;
    if (name) {
      author.name = name;
    }
    if (code) {
      author.code = code;
    }
    if (address) {
      author.address = address;
    }
    author.updatedBy = loggedInUser.id;
    return this.repository.save(author);
  }

  /**
   * Imports a author with the given data and sets createdBy to the user's ID.
   * @param {ImportAuthorDto} authorData - The data of the author to import.
   * @param {LoggedInUser} user - The user importing the author.
   * @returns {Promise<boolean>} - Whether the import was successful.
   */
  async importAuthor(authorData: ImportAuthorDto, user: LoggedInUser): Promise<boolean> {
    const dataToSave = authorData.data.map((item) => {
      return {
        ...item,
        createdBy: user.id,
      };
    });
    const savedData = await this.repository.save(dataToSave);
    return savedData.length === authorData.data.length;
  }
}
