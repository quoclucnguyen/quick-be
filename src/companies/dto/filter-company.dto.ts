import { ApiProperty } from "@nestjs/swagger";
import { AbstractFilter } from "src/common/abtract.filter";

export class FilterCompanyDto extends AbstractFilter {
  @ApiProperty({required: false})
  name?: string;

  @ApiProperty({required: false})
  code?: string;

}