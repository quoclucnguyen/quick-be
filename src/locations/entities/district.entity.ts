import { AbstractEntity } from 'src/common/abstract.entity';
import { CustomerEntity } from 'src/customers/entities/customer.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { Province } from './province.entity';
import { Ward } from './ward.entity';

export enum DistrictType {
  URBAN = 'urban',
  SUB_URBAN = 'sub_urban',
}

@Entity('districts')
export class District extends AbstractEntity {
  @Column({
    name: 'province_id',
    type: 'int',
    nullable: false,
  })
  provinceId: number;

  @Column({
    name: 'region_id',
    type: 'int',
    nullable: true,
  })
  regionId: number;

  @Column({
    type: 'enum',
    enum: DistrictType,
    nullable: true,
  })
  type: DistrictType;

  @Column({
    name: 'name',
    type: 'varchar',
    nullable: true,
  })
  name: string;

  @Column({
    name: 'code',
    type: 'varchar',
    nullable: true,
  })
  code: string;

  @ManyToOne(() => Province, (province) => province.districts)
  @JoinColumn({ name: 'province_id' })
  province: Province;

  @OneToMany(() => Ward, (ward) => ward.district)
  wards: Ward[];

  @OneToMany(() => CustomerEntity, (customer) => customer.district)
  customers: CustomerEntity[];
}
