import { ApiProperty } from '@nestjs/swagger';

export class OutletFilter {
  @ApiProperty()
  take = 10;

  @ApiProperty()
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
