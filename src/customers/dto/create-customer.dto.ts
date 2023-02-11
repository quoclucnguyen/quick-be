import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsAlphanumeric,
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

export class CreateCustomerDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsNumberString()
  @IsPhoneNumber('VN')
  @Transform((value: any) => value.trim(), { toPlainOnly: true })
  phone: string;

  @ApiProperty()
  @IsNotEmpty()
  @Transform((value: any) => value.trim(), { toPlainOnly: true })
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumberString()
  outletId: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Length(4,4)
  @IsNumberString()
  @Transform((value: any) => value.trim(), { toPlainOnly: true })
  otp: string;

  @ApiProperty({
    description: 'File hình ảnh',
    type: 'array',
    items: { type: 'string', format: 'binary' },
  })
  files: Express.Multer.File[];
}
