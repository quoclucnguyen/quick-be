import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class RejectDto {
  @ApiProperty({ description: 'Lý do hủy' })
  @IsString()
  @IsNotEmpty()
  reason: string;
}
