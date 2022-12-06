import { ApiProperty } from '@nestjs/swagger';

export class LoginTokenSuccessResponse {
  @ApiProperty()
  accessToken: string;
}
