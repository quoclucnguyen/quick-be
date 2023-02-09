import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { OutletsService } from './outlets.service';
import { CreateOutletDto } from './dto/create-outlet.dto';
import { UpdateOutletDto } from './dto/update-outlet.dto';
import { OutletFilter } from './dto/outlet.filter.dto';
import { CurrentUser } from 'src/auth/curent-user.decorator';
import { LoggedInUser } from 'src/users/entities/user.entity';

@Controller('outlets')
export class OutletsController {
  constructor(private readonly outletsService: OutletsService) {}

  @Post()
  create(
    @Body() createOutletDto: CreateOutletDto,
    @CurrentUser() user: LoggedInUser,
  ) {
    return this.outletsService.create(createOutletDto, user);
  }

  @Get()
  findAll(@Query() filter: OutletFilter) {
    return this.outletsService.findAllWithFilter(filter);
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.outletsService.findOne({ where: { id: id } });
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateOutletDto: UpdateOutletDto,
    @CurrentUser() user: LoggedInUser,
  ) {
    return this.outletsService.updateOutlet(+id, updateOutletDto, user);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.outletsService.remove(+id);
  }
}
