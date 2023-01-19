import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { UserRole } from '../entities/user.entity';

export class CreateUserDto {
  @ApiProperty()
  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  @ApiProperty()
  name: string;

  @IsNotEmpty()
  @ApiProperty()
  password: string;

  @IsNotEmpty()
  @ApiProperty()
  role: UserRole;

  @ApiProperty()
  provinceId: number;

  @ApiProperty()
  wardId: number;

  @ApiProperty()
  districtId: number;

  @ApiProperty()
  address: string;
}
