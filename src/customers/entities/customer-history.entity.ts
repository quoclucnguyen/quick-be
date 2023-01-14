import { ApiProperty } from '@nestjs/swagger';
import { AbstractEntity } from 'src/common/abstract.entity';
import { GiftEntity } from 'src/gifts/entities/gift.entity';
import { ImageEntity } from 'src/images/entities/image.entity';
import { District } from 'src/locations/entities/district.entity';
import { Province } from 'src/locations/entities/province.entity';
import { Ward } from 'src/locations/entities/ward.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { CustomerEntity } from './customer.entity';

@Entity('customer_histories')
export class CustomerHistoryEntity extends AbstractEntity {
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

  @Column({ name: 'province_id', nullable: true })
  provinceId: number;

  @Column({ name: 'district_id', nullable: true })
  districtId: number;

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

  @ManyToOne(() => ImageEntity, (image) => image.customerImageSn)
  @JoinColumn({ name: 'image_sn_id' })
  imageSn: ImageEntity;

  @Column({ name: 'image_recipt_id' })
  imageReciptId: number;

  @ManyToOne(() => ImageEntity, (image) => image.customerImageSn)
  @JoinColumn({ name: 'image_recipt_id' })
  imageRecipt: ImageEntity;

  @Column({ name: 'gift_id', nullable: true })
  giftId: number;

  @Column({
    name: 'status',
    type: 'enum',
    enum: ['new', 'done', 'reject', 'inprocess'],
  })
  status: 'new' | 'done' | 'reject' | 'inprocess';

  @Column({ name: 'customer_id' })
  customerId: number;

  @ManyToOne(() => CustomerEntity, (customer) => customer.customerHistories)
  @JoinColumn({ name: 'customer_id' })
  customer: CustomerEntity;

  @Column({ nullable: true })
  reason: string;
}
