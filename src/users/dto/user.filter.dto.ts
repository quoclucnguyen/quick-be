import { ApiProperty } from '@nestjs/swagger';

export class UserFilter {
  @ApiProperty()
  take = 10;

  @ApiProperty()
  skip = 0;

  @ApiProperty({ required: false })
  username?: string;

  @ApiProperty({ required: false })
  name?: string;
}
