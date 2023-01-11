import { AbstractEntity } from 'src/common/abstract.entity';
import { CustomerEntity } from 'src/customers/entities/customer.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { District } from './district.entity';

@Entity('provinces')
export class Province extends AbstractEntity {
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
    name: 'region_id',
    nullable: true,
    type: 'varchar',
  })
  regionId: string;

  @OneToMany(() => District, (district) => district.province)
  districts: District[];

  @OneToMany(() => CustomerEntity, (customer) => customer.province)
  customers: CustomerEntity[];
}
