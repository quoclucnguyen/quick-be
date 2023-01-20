import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsAlphanumeric,
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsPhoneNumber,
  IsString,
  Length,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateCustomerDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Transform((value: any) => value.trim(), { toPlainOnly: true })
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsNumberString()
  @IsPhoneNumber('VN')
  @Transform((value: any) => value.trim(), { toPlainOnly: true })
  phone: string;

  @ApiProperty({ description: 'Mã S/N' })
  @IsNotEmpty()
  @IsString()
  @IsAlphanumeric()
  @MinLength(15)
  @MaxLength(15)
  @Transform((value: any) => value.trim(), { toPlainOnly: true })
  serialNumber: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  @Transform((value: any) => value.trim(), { toPlainOnly: true })
  email: string;

  type: 'customer' | 'user';

  @ApiProperty({ description: 'File chụp mã S/N' })
  fileSN: Express.Multer.File;

  @ApiProperty({ description: 'File chụp hóa đơn mua hàng' })
  fileRecipt: Express.Multer.File;

  @ApiProperty({ description: 'Số CMND/CCCD' })
  @IsNotEmpty()
  @IsString()
  @IsNumberString()
  @Transform((value: any) => value.trim(), { toPlainOnly: true })
  @MinLength(9)
  @MaxLength(12)
  idCardNumber: string;

  @ApiProperty({ description: 'Ngày mua format `YYYY-MM-DD`' })
  @IsNotEmpty()
  @Type(() => Date)
  datePurchase: Date;

  @ApiProperty({ description: 'Dòng máy' })
  @IsNotEmpty()
  @IsString()
  @Transform((value: any) => value.trim(), { toPlainOnly: true })
  seriesPurchase: string;

  status: 'new' | 'done';
}
