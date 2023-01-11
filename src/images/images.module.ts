import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImageEntity } from './entities/image.entity';
import { ImagesService } from './images.service';

@Module({
  providers: [ImagesService],
  imports: [TypeOrmModule.forFeature([ImageEntity])],
  exports: [ImagesService],
})
export class ImagesModule {}
