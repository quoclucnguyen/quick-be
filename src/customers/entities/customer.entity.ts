import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/users/entities/user.entity';
import { AbstractEntity } from 'src/common/abstract.entity';
import { GiftEntity } from 'src/gifts/entities/gift.entity';
import { Province } from 'src/locations/entities/province.entity';
import { District } from 'src/locations/entities/district.entity';
import { Ward } from 'src/locations/entities/ward.entity';
import { ImageEntity } from 'src/images/entities/image.entity';

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
  @Column({ unique: true, name: 'serial_number' })
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

  @Column({ name: 'province_id' })
  provinceId: number;

  @Column({ name: 'district_id' })
  districtId: number;

  @Column({ name: 'ward_id' })
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

  @Column({ name: 'image_id' })
  imageId: number;

  @OneToOne(() => ImageEntity, (image) => image.customer)
  @JoinColumn({ name: 'image_id' })
  image: ImageEntity;

  @Column({ name: 'gift_id', nullable: true })
  giftId: number;
}
