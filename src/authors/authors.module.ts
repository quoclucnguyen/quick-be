import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthorsService } from './authors.service';
import { AuthorsController } from './authors.controller';
import { AuthorEntity } from './entities/author.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([AuthorEntity]),
  ],
  providers: [
    AuthorsService,
    AuthorsController,
  ],
  exports: [
    AuthorsService,
  ],
  controllers:[
     AuthorsController,
  ]
})
export class AuthorsModule {
}
