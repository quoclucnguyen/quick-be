import { ApiProperty } from "@nestjs/swagger";
import { AbstractFilter } from "src/common/abtract.filter";

export class FilterCustomerDto extends AbstractFilter {
    @ApiProperty({ required: false })
    code?: string;

    @ApiProperty({ required: false })
    outletName?: string;

    @ApiProperty({ required: false })
    name?: string;

    @ApiProperty({ required: false })
    phone?: string;

    @ApiProperty({ required: false })
    otp?: string;

    @ApiProperty({ required: false })
    provinceId?: number;

    @ApiProperty({ required: false })
    outletId?: number;

    @ApiProperty({ required: false })
    startDate?: number;

    @ApiProperty({ required: false })
    endDate?: number;
}