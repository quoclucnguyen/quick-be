import { CreateCustomerDto } from "./create-customer.dto";

export class CreateCustomerUserDto extends CreateCustomerDto {

    provinceId: number;
    districtId: number;
    wardId: number;
    address: string;
}