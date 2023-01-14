import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from 'src/auth/curent-user.decorator';
import { Public } from 'src/auth/jwt-auth.guard';
import { Roles } from 'src/auth/roles.decorator';
import { LoggedInUser, UserRole } from 'src/users/entities/user.entity';
import { MoreThan } from 'typeorm';
import { CreateGiftDto } from './dto/create-gift.dto';
import { CreateTransactionDto } from './dto/create-transaction.entity';
import { GiftsService } from './gifts.service';

@Controller('gifts')
@ApiTags('Gifts')
@ApiBearerAuth()
export class GiftsController {
  constructor(private readonly giftsService: GiftsService) { }

  @Get()
  findAll() {
    return this.giftsService.findAll({
      where: { isActive: true, id: MoreThan(0) },
    });
  }

  @Post()
  @Roles(...[UserRole.ADMIN, UserRole.SA])
  create(@CurrentUser() user: LoggedInUser, @Body() input: CreateGiftDto) {
    return this.giftsService.createGift(input, user);
  }

  @Get('/check')
  @Public()
  check() {
    return this.giftsService.check();
  }

  @Post('/transaction')
  @Roles(...[UserRole.ADMIN, UserRole.SA])
  transaction(
    @CurrentUser() user: LoggedInUser,
    @Body() createTransaction: CreateTransactionDto,
  ) {
    const { id, quantity } = createTransaction;
    return this.giftsService.createTransaction(id, quantity, user);
  }
}
