import { AbstractEntity } from 'src/common/abstract.entity';
import { Entity, Column, OneToMany } from 'typeorm';
import { SchemaDetailEntity } from './schema-detail.entity';

@Entity('schemas')
export class SchemaEntity extends AbstractEntity {
  @Column()
  name: string;

  @Column()
  code: string;

  @Column()
  location: string;

  @OneToMany(() => SchemaDetailEntity, (detail) => detail.schema)
  details: SchemaDetailEntity[];
}
