import { AbstractEntity } from 'src/common/abstract.entity';
import { OutletEntity } from 'src/outlets/entities/outlet.entity';
import { User } from 'src/users/entities/user.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { CustomerImageEntity } from './customer-image.entity';

@Entity({ name: 'customers' })
export class CustomerEntity extends AbstractEntity {
  @ManyToOne(() => User, (user) => user.customers)
  @JoinColumn({ name: 'created_by' })
  createdByUser: User;

  @Column({ name: 'outlet_id' })
  outletId: number;

  @Column({ name: 'name' })
  name: string;

  @Column({ name: 'phone' })
  phone: string;

  @Column({ name: 'otp' })
  otp: string;

  @Column({ name: 'created_at_timestamp' })
  createdAtTimestamp: number;

  @Column({ name: 'is_edit', default: false })
  isEdit: boolean;

  @OneToMany(
    () => CustomerImageEntity,
    (customerImage) => customerImage.customer,
    { cascade: true },
  )
  customerImages: CustomerImageEntity[];

  @ManyToOne(() => OutletEntity, (outlet) => outlet.customers)
  @JoinColumn({ name: 'outlet_id' })
  outlet: OutletEntity;
}
