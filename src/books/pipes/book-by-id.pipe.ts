import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from "@nestjs/common";
import { BookEntity } from "../entities/book.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Injectable()
export class BookByIdPipe implements PipeTransform<number, Promise<BookEntity>>{
  constructor(
    @InjectRepository(BookEntity)
    private booksRepository: Repository<BookEntity>,
  ) { }

  async transform(id: number) {
    const book = await this.booksRepository.findOneBy({ id });
    if (!book) {
      throw new BadRequestException('Book not exits');
    }
    return book;
  }

}