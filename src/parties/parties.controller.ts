import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CurrentUser } from 'src/auth/curent-user.decorator';
import { LoggedInUser } from 'src/users/entities/user.entity';
import { CreatePartyDto } from './dto/create-party.dto';
import { PartiesService } from './parties.service';

@ApiTags('Parties')
@Controller('parties')
export class PartiesController {
  constructor(private readonly partiesService: PartiesService) {}

  @Get()
  findAll() {
    return this.partiesService.findAll({ where: { isActive: true } });
  }

  @Post()
  create(@CurrentUser() user: LoggedInUser, @Body() input: CreatePartyDto) {
    return this.partiesService.createParty(input, user);
  }
}
