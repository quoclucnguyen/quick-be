import { Module } from '@nestjs/common';
import { GiftsService } from './gifts.service';
import { GiftsController } from './gifts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GiftEntity } from './entities/gift.entity';

@Module({
  controllers: [GiftsController],
  providers: [GiftsService],
  imports: [TypeOrmModule.forFeature([GiftEntity])],
})
export class GiftsModule {}
