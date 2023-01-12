import { AbstractEntity } from 'src/common/abstract.entity';
import { Column, Entity, JoinColumn, ManyToMany, ManyToOne } from 'typeorm';
import { CustomerEntity } from './customer.entity';

@Entity('customer_action_histories')
export class CustomerActionHistoryEntity extends AbstractEntity {
  @Column({ name: 'customer_id' })
  customerId: number;

  @Column({ name: 'action', type: 'enum', enum: ['done', 'reject', 'new'] })
  action: 'done' | 'reject' | 'new';

  @ManyToOne(
    () => CustomerEntity,
    (customer) => customer.customerActionHistories,
  )
  @JoinColumn({ name: 'customer_id' })
  customer: CustomerEntity;
}
