import {
  Entity,
  Column,
  OneToOne,
  JoinColumn,
  OneToMany,
  ManyToOne,
  ManyToMany,
  JoinTable,
  ChildEntity,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';
import { AbstractEntity } from '../../common/abstract.entity';
import { ApiProperty } from "@nestjs/swagger";


@Entity({name: 'book'})
export class BookEntity extends AbstractEntity {
  @Column({name: 'name'})
  @ApiProperty()
  name: string;

  @Column({name: 'code'})
  @ApiProperty()
  code: string;

  @Column({name: 'address'})
  @ApiProperty()
  address: string;


}

