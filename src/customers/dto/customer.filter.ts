import { ApiProperty } from '@nestjs/swagger';

export class CustomerFilter {
  @ApiProperty({ required: false })
  status?: 'new' | 'done' | 'reject' | 'inprocess';

  @ApiProperty({ required: false })
  provinceId?: number;

  @ApiProperty({ required: false })
  fromDate?: Date;

  @ApiProperty({ required: false })
  toDate?: Date;

  @ApiProperty({ required: false })
  take: 10;

  @ApiProperty({ required: false })
  skip: 0;

  @ApiProperty({ required: false })
  phone?: string;

  @ApiProperty({ required: false })
  name?: string;

  @ApiProperty({ required: false })
  serialNumber?: string;

  @ApiProperty({ required: false })
  email?: string;

  @ApiProperty({ required: false })
  type?: 'customer' | 'user';

  @ApiProperty({ required: false })
  giftId: number | null;

  @ApiProperty({ required: false })
  idCardNumber?: string;

  @ApiProperty({ required: false })
  seriesPurchase?: string;

  @ApiProperty({ required: false })
  datePurchase?: Date;
}
