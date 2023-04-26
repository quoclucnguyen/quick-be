import { ApiProperty } from "@nestjs/swagger";
import { AbstractFilter } from "src/common/abtract.filter";

export class FilterAuthorDto extends AbstractFilter {
  @ApiProperty({required: false})
  name?: string;

  @ApiProperty({required: false})
  code?: string;

  @ApiProperty({required: false})
  address?: string;

  @ApiProperty({required: false})
  ageNumber?: number;

  @ApiProperty({required: false})
  countTime?: number;

}