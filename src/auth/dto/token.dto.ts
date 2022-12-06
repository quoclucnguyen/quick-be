import { ApiProperty } from '@nestjs/swagger';

export class TokenDto {
  @ApiProperty({ required: true })
  accessToken: string;

  @ApiProperty({ required: false })
  firebaseToken: string;
}
