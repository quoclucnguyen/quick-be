import { AbstractEntity } from 'src/common/abstract.entity';
import { Column, Entity } from 'typeorm';

@Entity('projects')
export class ProjectEntity extends AbstractEntity {
  @Column('varchar')
  name: string;

  @Column('varchar', { unique: true })
  code: string;
}
