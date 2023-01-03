import { AbstractEntity } from 'src/common/abstract.entity';
import { Column, Entity } from 'typeorm';

@Entity('gifts')
export class GiftEntity extends AbstractEntity {
  @Column('varchar')
  code: string;

  @Column('varchar')
  name: string;
}
