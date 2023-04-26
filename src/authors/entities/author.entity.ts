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


@Entity({name: 'author'})
export class AuthorEntity extends AbstractEntity {
  @Column({name: 'name'})
  @ApiProperty()
  name: string;

  @Column({name: 'code'})
  @ApiProperty()
  code: string;

  @Column({name: 'address'})
  @ApiProperty()
  address: string;

  @Column({name: 'age_number'})
  @ApiProperty()
  ageNumber: number;

  @Column({name: 'count_time'})
  @ApiProperty()
  countTime: number;


}

