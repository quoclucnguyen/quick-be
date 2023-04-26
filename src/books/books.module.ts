import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BooksService } from './books.service';
import { BooksController } from './books.controller';
import { BookEntity } from './entities/book.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([BookEntity]),
  ],
  providers: [
    BooksService,
    BooksController,
  ],
  exports: [
    BooksService,
  ],
  controllers:[
     BooksController,
  ]
})
export class BooksModule {
}
