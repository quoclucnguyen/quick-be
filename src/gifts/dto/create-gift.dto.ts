import { ApiProperty } from '@nestjs/swagger';

export class CreateGiftDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  code: string;
}
