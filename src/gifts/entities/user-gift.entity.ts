import { ApiProperty } from "@nestjs/swagger";
import { AbstractEntity } from "src/common/abstract.entity";
import { User } from "src/users/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { GiftEntity } from "./gift.entity";

@Entity('user_gift')
export class UserGiftEntity extends AbstractEntity {
    @ApiProperty()
    @Column()
    quantity: number;

    @ApiProperty()
    @ManyToOne(() => User, (user) => user.userGifts)
    @JoinColumn({ name: 'user_id' })
    user: User;

    @ApiProperty()
    @ManyToOne(() => GiftEntity, (gift) => gift.userGifts)
    @JoinColumn({ name: 'gift_id', referencedColumnName: 'id' })
    gift: GiftEntity;
}