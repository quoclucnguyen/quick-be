import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { AbstractEntity } from '../../common/abstract.entity';
import { Exclude } from 'class-transformer';
import { UserGiftEntity } from 'src/gifts/entities/user-gift.entity';
import { ApiProperty } from '@nestjs/swagger';

export enum UserRole {
  SA = 'SA',
  USER = 'USER',
  ADMIN = 'ADMIN',
  HOTLINE = 'HOTLINE',
}

@Entity('users')
export class User {
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

  @Column({
    name: 'username',
    type: 'varchar',
    length: 255,
    nullable: false,
    unique: true,
  })
  username: string;

  @Column({
    name: 'password_hash',
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  @Exclude()
  passwordHash: string;

  @Column({
    name: 'email',
    type: 'varchar',
    length: 255,
    nullable: true,
    default: '',
  })
  email: string;

  @Column({
    name: 'name',
    type: 'varchar',
    length: 255,
  })
  name: string;

  @Column({
    name: 'phone',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  phone: string;

  @Column({
    name: 'role',
    type: 'enum',
    enum: UserRole,
    nullable: true,
  })
  role: UserRole;

  @Exclude()
  @Column({
    name: 'uuid',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  uuid: string;

  @Exclude()
  @Column({
    name: 'firebase_token',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  firebaseToken: string;

  @OneToMany(() => UserGiftEntity, (userGift) => userGift.user)
  userGifts: UserGiftEntity[];

  @Exclude()
  @Column({
    name: 'token',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  token: string;

  @ApiProperty()
  @Column({ name: 'province_id', nullable: true })
  provinceId: number;

  @ApiProperty()
  @Column({ name: 'district_id', nullable: true })
  districtId: number;

  @ApiProperty()
  @Column({ name: 'ward_id', nullable: true })
  wardId: number;

  @ApiProperty()
  @Column({ name: 'address', nullable: true })
  address: string;
}

export interface LoggedInUser {
  id: number;
  username: string;
  role: UserRole;
}
