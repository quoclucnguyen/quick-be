import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from "@nestjs/common";
import { AuthorEntity } from "../entities/author.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Injectable()
export class AuthorByIdPipe implements PipeTransform<number, Promise<AuthorEntity>>{
  constructor(
    @InjectRepository(AuthorEntity)
    private authorsRepository: Repository<AuthorEntity>,
  ) { }

  async transform(id: number) {
    const author = await this.authorsRepository.findOneBy({ id });
    if (!author) {
      throw new BadRequestException('Author not exits');
    }
    return author;
  }

}