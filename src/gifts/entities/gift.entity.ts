import { AbstractEntity } from 'src/common/abstract.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { UserGiftEntity } from './user-gift.entity';
import { CustomerEntity } from 'src/customers/entities/customer.entity';

@Entity('gifts')
export class GiftEntity extends AbstractEntity {
  @Column('varchar')
  code: string;

  @Column('varchar')
  name: string;

  @OneToMany(() => UserGiftEntity, (userGift) => userGift.gift)
  userGifts: UserGiftEntity[];

  @OneToMany(()=>CustomerEntity, customer=>customer.gift)
  customers: CustomerEntity[];
}
