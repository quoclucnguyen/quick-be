
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
import { AuthorsService } from './authors.service';
import { FilterAuthorDto } from './dto/filter-author.dto';
import { CreateAuthorDto } from './dto/create-author.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';
import { ImportAuthorDto } from './dto/import-author.dto';
import { AuthorEntity } from './entities/author.entity';
import { AuthorByIdPipe } from './pipes/author-by-id.pipe';


@ApiBearerAuth()
@ApiTags('Authors')
@Controller('authors')
export class AuthorsController {
  constructor(private readonly authorsService: AuthorsService) {}

  @Get()
  findAll(
    @Query() filter: FilterAuthorDto,
    @CurrentUser() user: LoggedInUser
    ) {
    return this.authorsService.findAllWithFilter(filter, user);
  }

  @Post()
  create(
    @Body() createAuthorDto: CreateAuthorDto,
    @CurrentUser() user: LoggedInUser,
  ) {
    return this.authorsService.create(createAuthorDto, user);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe, AuthorByIdPipe) author: AuthorEntity,
    @Body() updateAuthorDto: UpdateAuthorDto,
    @CurrentUser() user: LoggedInUser,
  ) {
    return this.authorsService.updateAuthor(author, updateAuthorDto, user);
  }

  @Delete(':id')
  delete(
    @Param('id') id: string,
  ){
    return this.authorsService.removeWithOpts({where:{id: +id}});
  }

  @Post('import')
  import(
    @CurrentUser() user: LoggedInUser,
    @Body() importAuthorDto: ImportAuthorDto,
  ){
    return this.authorsService.importAuthor(importAuthorDto, user);
  }
}