import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateCustomerDto {
  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  phone: string;

  @ApiProperty()
  @IsNotEmpty()
  serialNumber: string;

  @ApiProperty()
  @IsNotEmpty()
  address: string;

  @ApiProperty()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  type: 'customer' | 'user'

  @ApiProperty()
  @IsNotEmpty()
  file: Express.Multer.File;

  @ApiProperty()
  @IsNotEmpty()
  provinceId: number;

  @ApiProperty()
  @IsNotEmpty()
  districtId: number;

  @ApiProperty()
  @IsNotEmpty()
  wardId: number;

}
