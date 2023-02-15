import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsAlphanumeric,
  IsDate,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsPhoneNumber,
  IsString,
  Length,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { CreateCustomerDto } from './create-customer.dto';

export class EditCustomerDto extends CreateCustomerDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumberString()
  time: number;
}
