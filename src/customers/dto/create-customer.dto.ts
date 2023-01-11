import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateCustomerDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Transform((value: any) => value.trim(), { toPlainOnly: true })
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Transform((value: any) => value.trim(), { toPlainOnly: true })
  phone: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Transform((value: any) => value.trim(), { toPlainOnly: true })
  serialNumber: string;

  @ApiProperty()
  @Transform((value: any) => value.trim(), { toPlainOnly: true })
  address: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Transform((value: any) => value.trim(), { toPlainOnly: true })
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Transform((value: any) => value.trim(), { toPlainOnly: true })
  type: 'customer' | 'user';

  @ApiProperty()
  file: Express.Multer.File;

  @ApiProperty()
  @IsNotEmpty()
  @Type(() => Number)
  provinceId: number;

  @ApiProperty()
  @IsNotEmpty()
  @Type(() => Number)
  districtId: number;

  @ApiProperty()
  @IsNotEmpty()
  @Type(() => Number)
  wardId: number;l
}
