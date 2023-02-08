import { Transform } from 'class-transformer';
import { AbstractEntity } from 'src/common/abstract.entity';
import { CustomerImageEntity } from 'src/customers/entities/customer-image.entity';
import { CustomerEntity } from 'src/customers/entities/customer.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne } from 'typeorm';

@Entity('images')
export class ImageEntity extends AbstractEntity {
  @Column({
    name: 'name',
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  name: string;

  @Transform((value) => {
    return process.env.APP_HOST + value.value;
  })
  @Column({
    name: 'path',
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  path: string;

  @OneToMany(() => CustomerImageEntity, customerImage => customerImage.image)
  customerImages: CustomerImageEntity[];

}

export enum ImageType {
  ATTENDANCE_IN = 'ATTENDANCE_IN',
  ATTENDANCE_OUT = 'ATTENDANCE_OUT',
  OUTLET_IMAGE = 'OUTLET_IMAGE',
}

export const IMAGE_EXT_ALLOWED = ['image/jpeg', 'image/png', 'image/jpg'];
