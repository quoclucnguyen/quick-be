import { AbstractEntity } from 'src/common/abstract.entity';
import { District } from 'src/locations/entities/district.entity';
import { Province } from 'src/locations/entities/province.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity('outlets')
export class OutletEntity extends AbstractEntity {
  @Column()
  name: string;

  @Column()
  code: string;

  @Column({ name: 'provine_id' })
  provinceId: number;

  @Column({ name: 'district_id' })
  districtId: number;

  @Column()
  address: string;

  @ManyToOne(() => Province, (province) => province.outlets)
  @JoinColumn({ name: 'province_id' })
  province: Province;

  @ManyToOne(() => District, (district) => district.outlets)
  @JoinColumn({ name: 'district_id' })
  district: District;
}