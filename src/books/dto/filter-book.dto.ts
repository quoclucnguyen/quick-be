import { ApiProperty } from "@nestjs/swagger";
import { AbstractFilter } from "src/common/abtract.filter";

export class FilterBookDto extends AbstractFilter {
  @ApiProperty({required: false})
  name?: string;

  @ApiProperty({required: false})
  code?: string;

  @ApiProperty({required: false})
  address?: string;

}