import { AbstractEntity } from 'src/common/abstract.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { UserGiftEntity } from './user-gift.entity';
import { CustomerEntity } from 'src/customers/entities/customer.entity';
import { GiftTransactionEntity } from './gift-transaction.entity';
import { Transform } from 'class-transformer';

@Entity('gifts')
export class GiftEntity extends AbstractEntity {
  @Column('varchar')
  code: string;

  @Column('varchar')
  name: string;

  @OneToMany(() => UserGiftEntity, (userGift) => userGift.gift)
  userGifts: UserGiftEntity[];

  @OneToMany(() => CustomerEntity, (customer) => customer.gift)
  customers: CustomerEntity[];

  @Column({ default: 0, nullable: true })
  quantity: number;

  @Transform((value) => {
    return process.env.APP_HOST + value.value;
  })
  @Column({ name: 'image_url', nullable: true })
  imageUrl: string;

  @OneToMany(() => GiftTransactionEntity, (transaction) => transaction.gift)
  giftTransactions: GiftTransactionEntity[];
}
