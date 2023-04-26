import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsOrder, FindOptionsWhere, Like, Repository } from 'typeorm';
import { AbstractService } from 'src/common/abstract.service';
import { LoggedInUser } from 'src/users/entities/user.entity';
import { BookEntity } from './entities/book.entity';
import { FilterBookDto } from './dto/filter-book.dto';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { ImportBookDto } from './dto/import-book.dto';

@Injectable()
export class BooksService extends AbstractService<BookEntity> {
  constructor(
    @InjectRepository(BookEntity)
    repository: Repository<BookEntity>,
  ) {
    super(BooksService.name, repository);
  }

  /**
   * Finds all entities that match the given filter criteria.
   * @param {FilterBookDto} filter - The filter criteria to apply.
   * @param {LoggedInUser} loggedInUser - The user performing the search.
   * @returns {Promise<{ entities: BookEntity[], count: number }>} An object containing the matching entities and the total count.
   */
  async findAllWithFilter(
    filter: FilterBookDto,
    loggedInUser: LoggedInUser
  ): Promise<{ entities: BookEntity[], count: number }> {
    const {
      take, 
      skip,
        name,
        code,
        address,
    } = filter;
    const whereClause: FindOptionsWhere<BookEntity> = {
      isActive: true,
          name: Like(filter?.name ? `%${filter.name}%` : '%%'),
          code: Like(filter?.code ? `%${filter.code}%` : '%%'),
          address: Like(filter?.address ? `%${filter.address}%` : '%%'),
    };
    const orderClause: FindOptionsOrder<BookEntity> = {
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
   * Creates a new book in the repository.
   * @param {CreateBookDto} input - The details of the book to create.
   * @param {LoggedInUser} loggedInUser - The user who is creating the book.
   * @returns {Promise<BookEntity>} The newly created book.
  **/
  async create(input: CreateBookDto, loggedInUser: LoggedInUser): Promise<BookEntity> {
    const book = this.repository.create(input);
    book.createdBy = loggedInUser.id;
    return this.repository.save(book);
  }

  /**
   * Updates a book entity in the database
   * @param {BookEntity} book - The book entity to be updated
   * @param {UpdateBookDto} input - The updated book data
   * @param {LoggedInUser} loggedInUser - The logged in user making the update
   * @returns The updated book entity
   */
  async updateBook(book: BookEntity, input: UpdateBookDto, loggedInUser: LoggedInUser) : Promise<BookEntity> {
    const { name, code, address } = input;
    if (name) {
      book.name = name;
    }
    if (code) {
      book.code = code;
    }
    if (address) {
      book.address = address;
    }
    book.updatedBy = loggedInUser.id;
    return this.repository.save(book);
  }

  /**
   * Imports a book with the given data and sets createdBy to the user's ID.
   * @param {ImportBookDto} bookData - The data of the book to import.
   * @param {LoggedInUser} user - The user importing the book.
   * @returns {Promise<boolean>} - Whether the import was successful.
   */
  async importBook(bookData: ImportBookDto, user: LoggedInUser): Promise<boolean> {
    const dataToSave = bookData.data.map((item) => {
      return {
        ...item,
        createdBy: user.id,
      };
    });
    const savedData = await this.repository.save(dataToSave);
    return savedData.length === bookData.data.length;
  }
}
