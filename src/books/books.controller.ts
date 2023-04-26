
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
import { BooksService } from './books.service';
import { FilterBookDto } from './dto/filter-book.dto';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { ImportBookDto } from './dto/import-book.dto';
import { BookEntity } from './entities/book.entity';
import { BookByIdPipe } from './pipes/book-by-id.pipe';


@ApiBearerAuth()
@ApiTags('Books')
@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Get()
  findAll(
    @Query() filter: FilterBookDto,
    @CurrentUser() user: LoggedInUser
    ) {
    return this.booksService.findAllWithFilter(filter, user);
  }

  @Post()
  create(
    @Body() createBookDto: CreateBookDto,
    @CurrentUser() user: LoggedInUser,
  ) {
    return this.booksService.create(createBookDto, user);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe, BookByIdPipe) book: BookEntity,
    @Body() updateBookDto: UpdateBookDto,
    @CurrentUser() user: LoggedInUser,
  ) {
    return this.booksService.updateBook(book, updateBookDto, user);
  }

  @Delete(':id')
  delete(
    @Param('id') id: string,
  ){
    return this.booksService.removeWithOpts({where:{id: +id}});
  }

  @Post('import')
  import(
    @CurrentUser() user: LoggedInUser,
    @Body() importBookDto: ImportBookDto,
  ){
    return this.booksService.importBook(importBookDto, user);
  }
}