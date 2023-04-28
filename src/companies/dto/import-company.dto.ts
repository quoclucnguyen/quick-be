import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class ImportCompanyItem {
	@ApiProperty()
	name: string;

	@ApiProperty()
	code: string;

}

export class ImportCompanyDto {
	@IsArray()
	@ValidateNested({ each: true })
	@ApiProperty({type: [ImportCompanyItem]})
  @IsNotEmpty()
	@Type(() => ImportCompanyItem)
  data: ImportCompanyItem[]
}
