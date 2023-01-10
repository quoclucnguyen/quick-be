import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/users/entities/user.entity';
import { AbstractEntity } from 'src/common/abstract.entity';
import { GiftEntity } from 'src/gifts/entities/gift.entity';

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
  @Column()
  address: string;

  @ApiProperty()
  @Column()
  email: string;

  @ApiProperty()
  @ManyToOne(() => GiftEntity, gift => gift.customers)
  @JoinColumn({ name: 'gift_id' })
  gift: GiftEntity;

  @ApiProperty()
  @Column({
    name: 'type',
    type: 'enum',
    enum: {
      'customer': 'customer',
      'user': 'user'
    }
  })
  type: 'customer' | 'user'

  @Column({ name: 'province_id' })
  provinceId: number;

  @Column({ name: 'district_id' })
  districtId: number;

  @Column({ name: 'ward_id' })
  wardId: number;
}
