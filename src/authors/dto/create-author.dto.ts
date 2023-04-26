import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumberString } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateAuthorDto {
  @ApiProperty({})
  @IsNotEmpty()
  name: string;

  @ApiProperty({})
  @IsNotEmpty()
  code: string;

  @ApiProperty({})
  @IsNotEmpty()
  address: string;

  @ApiProperty({})
  @IsNotEmpty()
  @IsNumberString()
  ageNumber: number;

  @ApiProperty({})
  @IsNotEmpty()
  @IsNumberString()
  countTime: number;

}