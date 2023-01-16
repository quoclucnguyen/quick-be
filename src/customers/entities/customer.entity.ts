import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  OneToOne,
  OneToMany,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { AbstractEntity } from 'src/common/abstract.entity';
import { GiftEntity } from 'src/gifts/entities/gift.entity';
import { Province } from 'src/locations/entities/province.entity';
import { District } from 'src/locations/entities/district.entity';
import { Ward } from 'src/locations/entities/ward.entity';
import { ImageEntity } from 'src/images/entities/image.entity';
import { CustomerHistoryEntity } from './customer-history.entity';
import { CustomerActionHistoryEntity } from './customer-action-history.entity';

@Entity({ name: 'customer' })
export class CustomerEntity extends AbstractEntity {
  @ApiProperty()
  @Column({
    name: 'name',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  name: string;

  @ApiProperty()
  @Column({
    name: 'phone',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  phone: string;

  @ApiProperty()
  @Column({ name: 'serial_number' })
  serialNumber: string;

  @ApiProperty()
  @Column({ nullable: true })
  address: string;

  @ApiProperty()
  @Column()
  email: string;

  @ApiProperty()
  @ManyToOne(() => GiftEntity, (gift) => gift.customers)
  @JoinColumn({ name: 'gift_id' })
  gift: GiftEntity;

  @ApiProperty()
  @Column({
    name: 'type',
    type: 'enum',
    enum: {
      customer: 'customer',
      user: 'user',
    },
  })
  type: 'customer' | 'user';

  @ApiProperty()
  @Column({ name: 'province_id', nullable: true })
  provinceId: number;

  @ApiProperty()
  @Column({ name: 'district_id', nullable: true })
  districtId: number;

  @ApiProperty()
  @Column({ name: 'ward_id', nullable: true })
  wardId: number;

  @ManyToOne(() => Province, (province) => province.customers)
  @JoinColumn({ name: 'province_id' })
  province: Province;

  @ManyToOne(() => District, (district) => district.customers)
  @JoinColumn({ name: 'district_id' })
  district: District;

  @ManyToOne(() => Ward, (ward) => ward.customers)
  @JoinColumn({ name: 'ward_id' })
  ward: Ward;

  @Column({ name: 'image_sn_id' })
  imageSNId: number;

  @ApiProperty()
  @ManyToOne(() => ImageEntity, (image) => image.customerImageSn)
  @JoinColumn({ name: 'image_sn_id' })
  imageSn: ImageEntity;

  @ApiProperty()
  @Column({ name: 'image_recipt_id' })
  imageReciptId: number;

  @ApiProperty()
  @ManyToOne(() => ImageEntity, (image) => image.customerImageSn)
  @JoinColumn({ name: 'image_recipt_id' })
  imageRecipt: ImageEntity;

  @Column({ name: 'gift_id', nullable: true })
  giftId: number;

  @ApiProperty()
  @Column({
    name: 'status',
    type: 'enum',
    enum: ['new', 'done', 'reject', 'inprocess'],
    default: 'new',
  })
  status: 'new' | 'done' | 'reject' | 'inprocess';

  @ApiProperty()
  @OneToMany(() => CustomerHistoryEntity, (history) => history.customer, {
    cascade: true,
  })
  customerHistories: CustomerHistoryEntity[];

  @ApiProperty()
  @Column({ nullable: true, name: 'reject_reason' })
  rejectReason: string;

  @ApiProperty()
  @Column({ name: 'id_card_number' })
  idCardNumber: string;

  @ApiProperty()
  @Column({ name: 'date_purchase' })
  datePurchase: Date;

  @ApiProperty()
  @Column({ name: 'series_purchase' })
  seriesPurchase: string;

  @ApiProperty()
  @Column({ nullable: true, type: 'text' })
  reason: string;

  @OneToMany(
    () => CustomerActionHistoryEntity,
    (customerActionHistory) => customerActionHistory.customer,
    { cascade: true },
  )
  customerActionHistories: CustomerActionHistoryEntity[];
}
