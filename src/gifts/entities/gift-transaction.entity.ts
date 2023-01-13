import { AbstractEntity } from 'src/common/abstract.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { GiftEntity } from './gift.entity';

@Entity('gift_transaction')
export class GiftTransactionEntity extends AbstractEntity {
  @Column({ name: 'gift_id' })
  giftId: number;

  @Column({ name: 'quantity' })
  quantity: number;

  @ManyToOne(() => GiftEntity, (gift) => gift.giftTransactions)
  @JoinColumn({ name: 'gift_id' })
  gift: GiftEntity;
}
