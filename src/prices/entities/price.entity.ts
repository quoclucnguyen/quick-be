import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { AbstractEntity } from 'src/common/abstract.entity';
import { CustomerEntity } from 'src/customers/entities/customer.entity';

@Entity({ name: 'prices' })
export class PriceEntity extends AbstractEntity {
  @ApiProperty()
  @Column()
  name: string;

  @ApiProperty()
  @Column()
  code: string;

  @ApiProperty()
  @Column({ name: 'image_url' })
  imageUrl: string;

  @ApiProperty()
  @OneToMany(() => CustomerEntity, (customer) => customer.price)
  customers: CustomerEntity[];
}
