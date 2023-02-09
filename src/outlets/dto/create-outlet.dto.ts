import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateOutletDto {
  @ApiProperty()
  @IsNotEmpty()
  code: string;

  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  provindeId: number;

  @ApiProperty()
  @IsNotEmpty()
  districtId: number;

  @ApiProperty()
  @IsNotEmpty()
  address: string;
}
