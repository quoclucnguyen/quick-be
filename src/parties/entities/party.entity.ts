import { AbstractEntity } from 'src/common/abstract.entity';
import { Column, Entity } from 'typeorm';

@Entity('parties')
export class PartyEntity extends AbstractEntity {
  @Column('varchar', { name: 'code' })
  code: string;

  @Column('date')
  start: Date;

  @Column('date')
  end: Date;

  @Column('enum', { name: 'type', enum: { DEFAULT: 'DEFAULT' } })
  type: 'DEFAULT';

  @Column('enum', { name: 'location', enum: { HA_NOI: 'HA_NOI' } })
  location: 'HA_NOI';
}
