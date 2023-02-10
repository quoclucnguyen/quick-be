import { ApiProperty } from '@nestjs/swagger';

export class OutletFilter {
  @ApiProperty({ type: 'number' })
  take = 10;

  @ApiProperty({ type: 'number' })
  skip = 0;

  @ApiProperty({ required: false })
  name?: string;

  @ApiProperty({ required: false })
  code?: string;

  @ApiProperty({ required: false })
  address?: string;

  @ApiProperty({ required: false })
  provinceId?: number;

  @ApiProperty({ required: false })
  districtId?: number;
}
