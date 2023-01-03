import { ApiProperty } from '@nestjs/swagger';

export class CreatePartyDto {
  @ApiProperty()
  code: string;

  @ApiProperty()
  start: Date;

  @ApiProperty()
  end: Date;

  @ApiProperty()
  type: 'DEFAULT';

  @ApiProperty()
  location: 'HA_NOI';
}
