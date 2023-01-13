import { Module } from '@nestjs/common';
import { GiftsService } from './gifts.service';
import { GiftsController } from './gifts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GiftEntity } from './entities/gift.entity';
import { UserGiftEntity } from './entities/user-gift.entity';
import { GiftTransactionEntity } from './entities/gift-transaction.entity';

@Module({
  controllers: [GiftsController],
  providers: [GiftsService],
  imports: [
    TypeOrmModule.forFeature([
      GiftEntity,
      UserGiftEntity,
      GiftTransactionEntity,
    ]),
  ],
  exports: [GiftsService],
})
export class GiftsModule {}
