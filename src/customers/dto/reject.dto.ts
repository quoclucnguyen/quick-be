import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class RejectDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  reason: string;
}
