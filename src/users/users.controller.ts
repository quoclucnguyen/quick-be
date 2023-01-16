import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  Patch,
} from '@nestjs/common';
import { LoggedInUser, UserRole } from './entities/user.entity';
import { CurrentUser } from '../auth/curent-user.decorator';
import { Roles } from '../auth/roles.decorator';
import { Public } from '../auth/jwt-auth.guard';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UserFilter } from './dto/user.filter.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Users')
@Controller('users')
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/me')
  me(@CurrentUser() user: LoggedInUser) {
    return user;
  }

  @Get()
  findAll(@Query() filter: UserFilter) {
    return this.usersService.findAllAndCount(filter);
  }

  @Post()
  create(@Body() input: CreateUserDto, @CurrentUser() user: LoggedInUser) {
    return this.usersService.create(input, user);
  }

  @Patch()
  update(@Body() input: UpdateUserDto, @CurrentUser() user: LoggedInUser) {
    return this.usersService.updateUser(input, user);
  }
}
