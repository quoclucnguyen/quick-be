import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { CreateCustomerDto } from './create-customer.dto';

export class CreateCustomerCustomerDto extends CreateCustomerDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  provinceId: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  districtId: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  wardId: number;

  @ApiProperty()
  @Transform((value: any) => value.trim(), { toPlainOnly: true })
  address: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Transform((value: any) => value.trim(), { toPlainOnly: true })
  recaptchaToken: string;
}
