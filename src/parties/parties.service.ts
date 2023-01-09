import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AbstractService } from 'src/common/abstract.service';
import { LoggedInUser } from 'src/users/entities/user.entity';
import { DataSource, Repository } from 'typeorm';
import { CreatePartyDto } from './dto/create-party.dto';
import { PartyEntity } from './entities/party.entity';

@Injectable()
export class PartiesService extends AbstractService<PartyEntity> {
  constructor(
    @InjectRepository(PartyEntity)
    repository: Repository<PartyEntity>,
    private dataSource: DataSource,
  ) {
    super(PartiesService.name, repository);
  }

  createParty(input: CreatePartyDto, user: LoggedInUser) {
    const party = this.repository.create(input);
    party.createdBy = user.id;
    return this.repository.save(party);
  }
}
