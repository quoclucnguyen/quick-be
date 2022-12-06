import { Column, Entity } from 'typeorm';
import { AbstractEntity } from '../../common/abstract.entity';
import { Exclude } from 'class-transformer';

export enum UserRole {
  SA = 'SA',
  USER = 'USER',
  ADMIN = 'ADMIN',
}

@Entity('users')
export class User extends AbstractEntity {
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
}
export interface LoggedInUser {
  id: number;
  username: string;
  role: UserRole;
}
