import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PartyEntity } from './entities/party.entity';
import { PartiesController } from './parties.controller';
import { PartiesService } from './parties.service';

@Module({
  controllers: [PartiesController],
  providers: [PartiesService],
  imports: [TypeOrmModule.forFeature([PartyEntity])],
})
export class PartiesModule {}
