import { AbstractEntity } from "src/common/abstract.entity";
import { ImageEntity } from "src/images/entities/image.entity";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { CustomerEntity } from "./customer.entity";

@Entity({ name: 'customer_images' })
export class CustomerImageEntity extends AbstractEntity {
    @Column({ name: 'customer_id' })
    customerId: number;

    @ManyToOne(() => CustomerEntity, customer => customer.customerImages)
    @JoinColumn({ name: 'customer_id' })
    customer: CustomerEntity;

    @Column({ name: 'image_id' })
    imageId: number;

    @ManyToOne(() => ImageEntity, image => image.customerImages)
    @JoinColumn({ name: 'image_id' })
    image: ImageEntity;
}