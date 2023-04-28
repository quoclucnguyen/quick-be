import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumberString } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateCompanyDto {
  @ApiProperty({})
  @IsNotEmpty()
  name: string;

  @ApiProperty({})
  @IsNotEmpty()
  code: string;

}