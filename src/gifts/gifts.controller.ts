import { Body, Controller, Get, Post } from '@nestjs/common';
import { CurrentUser } from 'src/auth/curent-user.decorator';
import { LoggedInUser } from 'src/users/entities/user.entity';
import { CreateGiftDto } from './dto/create-gift.dto';
import { GiftsService } from './gifts.service';

@Controller('gifts')
export class GiftsController {
  constructor(private readonly giftsService: GiftsService) {}

  @Get()
  findAll() {
    return this.giftsService.findAll({ where: { isActive: true } });
  }

  @Post()
  create(@CurrentUser() user: LoggedInUser, @Body() input: CreateGiftDto) {
    return this.giftsService.createGift(input, user);
  }
}
