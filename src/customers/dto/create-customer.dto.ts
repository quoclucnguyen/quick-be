import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsAlphanumeric,
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsPhoneNumber,
  IsString,
  MaxLength,
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
  @IsNumber()
  outletId: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsAlphanumeric()
  @MinLength(4)
  @MaxLength(4)
  @Transform((value: any) => value.trim(), { toPlainOnly: true })
  otp: string;

  @ApiProperty({
    description: 'File hình ảnh',
    type: 'array',
    items: { type: 'string', format: 'binary' },
  })
  files: Express.Multer.File[];
}
