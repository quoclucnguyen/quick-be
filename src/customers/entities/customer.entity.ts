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
import { PriceEntity } from 'src/prices/entities/price.entity';

@Entity({ name: 'customer' })
export class CustomerEntity extends AbstractEntity {
  @ApiProperty()
  @Column({ name: 'party_id', type: 'varchar', length: 255 })
  partyId: string;

  @ApiProperty()
  @Column({
    name: 'customer_name',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  customerName: string;

  @ApiProperty()
  @Column({
    name: 'customer_phone',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  customerPhone: string;

  @ApiProperty()
  @Column({ name: 'guest_name', type: 'varchar', length: 255, nullable: true })
  guestName: string;

  @ApiProperty({ default: 1 })
  @Column({ type: 'tinyint', default: 1 })
  status: number;

  @ApiProperty()
  @Column({ name: 'is_topup', type: 'bit', nullable: true })
  isTopup: boolean;

  @ApiProperty()
  @Column({ name: 'guest_phone', type: 'varchar', length: 255, nullable: true })
  guestPhone: string;

  @ApiProperty()
  @Column({ name: 'turn_count', type: 'int', nullable: true })
  turnCount: number;

  @ApiProperty()
  @ManyToOne(() => PriceEntity, (price) => price.customers)
  @JoinColumn({ name: 'price_id' })
  price: PriceEntity;
}
