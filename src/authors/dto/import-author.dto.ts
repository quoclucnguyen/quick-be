import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class ImportAuthorItem {
	@ApiProperty()
	name: string;

	@ApiProperty()
	code: string;

	@ApiProperty()
	address: string;

	@ApiProperty()
	ageNumber: number;

	@ApiProperty()
	countTime: number;

}

export class ImportAuthorDto {
	@IsArray()
	@ValidateNested({ each: true })
	@ApiProperty({type: [ImportAuthorItem]})
  @IsNotEmpty()
	@Type(() => ImportAuthorItem)
  data: ImportAuthorItem[]
}
