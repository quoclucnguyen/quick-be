import { ApiProperty } from '@nestjs/swagger';

export class CustomerFilter {
  @ApiProperty()
  status?: 'new' | 'done' | 'reject' | 'inprocess';

  @ApiProperty()
  provinceId?: number;

  @ApiProperty()
  fromDate?: Date;

  @ApiProperty()
  toDate?: Date;

  @ApiProperty()
  take: 10;

  @ApiProperty()
  skip: 0;

  @ApiProperty()
  phone?: string;

  @ApiProperty()
  name?: string;

  @ApiProperty()
  serialNumber?: string;

  @ApiProperty()
  email?: string;

  @ApiProperty()
  type?: 'customer' | 'user';

  @ApiProperty()
  giftId: number | null;

  @ApiProperty()
  idCardNumber?: string;

  @ApiProperty()
  seriesPurchase?: string;

  @ApiProperty()
  datePurchase?: Date;
}
