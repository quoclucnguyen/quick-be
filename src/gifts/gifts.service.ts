import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AbstractService } from 'src/common/abstract.service';
import { LoggedInUser } from 'src/users/entities/user.entity';
import { DataSource, Repository } from 'typeorm';
import { CreateGiftDto } from './dto/create-gift.dto';
import { GiftEntity } from './entities/gift.entity';

@Injectable()
export class GiftsService extends AbstractService<GiftEntity> {
  constructor(
    @InjectRepository(GiftEntity)
    repository: Repository<GiftEntity>,
    private dataSource: DataSource,
  ) {
    super(GiftsService.name, repository);
  }

  createGift(input: CreateGiftDto, user: LoggedInUser) {
    const gift = this.repository.create(input);
    gift.createdBy = user.id;
    return this.repository.save(gift);
  }
}
