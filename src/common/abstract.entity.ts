import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import {
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Column,
} from 'typeorm';

export class AbstractEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @ApiProperty()
  @CreateDateColumn({
    type: 'timestamp',
    name: 'created_at',
  })
  createdAt = new Date();

  @ApiProperty()
  @UpdateDateColumn({
    type: 'timestamp',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
    name: 'updated_at',
  })
  updatedAt: Date;

  @ApiProperty()
  @Exclude()
  @Column('int', { name: 'created_by', nullable: true })
  createdBy: number;

  @ApiProperty()
  @Exclude()
  @Column('int', { name: 'updated_by', nullable: true })
  updatedBy: number;

  @ApiProperty()
  @Column('boolean', { name: 'is_active', default: true })
  isActive: boolean;
}
