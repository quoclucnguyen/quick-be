import { AbstractEntity } from 'src/common/abstract.entity';
import { CustomerEntity } from 'src/customers/entities/customer.entity';
import { User } from 'src/users/entities/user.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { District } from './district.entity';

@Entity('wards')
export class Ward extends AbstractEntity {
  @Column({
    name: 'name',
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  name: string;

  @Column({
    name: 'code',
    nullable: true,
    type: 'varchar',
  })
  code: string;

  @Column({
    name: 'district_id',
    nullable: true,
    type: 'int',
  })
  districtId: number;

  @ManyToOne(() => District, (district) => district.wards)
  @JoinColumn({ name: 'district_id' })
  district: District;

  @OneToMany(() => CustomerEntity, (customer) => customer.ward)
  customers: CustomerEntity[];

  @OneToMany(() => User, user => user.ward)
  users: User[];
}
