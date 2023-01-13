import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AbstractService } from 'src/common/abstract.service';
import { LoggedInUser } from 'src/users/entities/user.entity';
import { DataSource, MoreThan, Repository } from 'typeorm';
import { CreateGiftDto } from './dto/create-gift.dto';
import { GiftTransactionEntity } from './entities/gift-transaction.entity';
import { GiftEntity } from './entities/gift.entity';

@Injectable()
export class GiftsService extends AbstractService<GiftEntity> {
  constructor(
    @InjectRepository(GiftEntity)
    repository: Repository<GiftEntity>,
    private dataSource: DataSource,
    @InjectRepository(GiftTransactionEntity)
    private readonly giftTransactionRepository: Repository<GiftTransactionEntity>,
  ) {
    super(GiftsService.name, repository);
  }

  createGift(input: CreateGiftDto, user: LoggedInUser) {
    const gift = this.repository.create(input);
    gift.createdBy = user.id;
    return this.repository.save(gift);
  }

  async check() {
    const gift = await this.repository.findOne({
      where: {
        id: MoreThan(0),
        isActive: true,
        quantity: MoreThan(0),
      },
    });
    if (gift !== null) {
      return { isHaveGiftEnough: true };
    } else {
      return { isHaveGiftEnough: false };
    }
  }

  async createTransaction(id: number, quantity: number, user: LoggedInUser) {
    const gift = await this.repository.findOne({
      where: { id: id, isActive: true },
    });
    if (gift === null) {
      throw new BadRequestException('Không tìm thấy quà');
    }
    const total = quantity + gift.quantity;
    if (total < 0) {
      throw new BadRequestException('Số lượng không hợp lệ');
    }
    const transaction = this.giftTransactionRepository.create();
    transaction.createdBy = user.id;
    transaction.quantity = quantity;
    transaction.giftId = id;
    
    await this.giftTransactionRepository.save(transaction);
    await this.repository.update(
      { id: id },
      { quantity: total, updatedBy: user.id },
    );
    return true;
  }
}
