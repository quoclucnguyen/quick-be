import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class RejectConfirmDto {
  @ApiProperty({ description: 'Lý do chuyển' })
  reason?: string;
}
