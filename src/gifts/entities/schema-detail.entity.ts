import { AbstractEntity } from 'src/common/abstract.entity';
import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { SchemaEntity } from './schema.entity';

@Entity()
export class SchemaDetailEntity extends AbstractEntity {
  @Column('int', { name: 'gift_id' })
  giftId: string;

  @Column()
  quanlity: number;

  @ManyToOne(() => SchemaEntity, (schema) => schema.details)
  @JoinColumn({ name: 'schema_id' })
  schema: SchemaEntity;
}
