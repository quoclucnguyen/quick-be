import { ApiProperty } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import { IsNotEmpty } from "class-validator";
import { CreateCustomerDto } from "./create-customer.dto";

export class CreateCustomerCustomerDto extends CreateCustomerDto {
    @ApiProperty()
    @IsNotEmpty()
    @Type(() => Number)
    provinceId: number;

    @ApiProperty()
    @IsNotEmpty()
    @Type(() => Number)
    districtId: number;

    @ApiProperty()
    @IsNotEmpty()
    @Type(() => Number)
    wardId: number;

    @ApiProperty()
    @Transform((value: any) => value.trim(), { toPlainOnly: true })
    address: string;
}