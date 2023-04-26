import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class ImportBookItem {
	@ApiProperty()
	name: string;

	@ApiProperty()
	code: string;

	@ApiProperty()
	address: string;

}

export class ImportBookDto {
	@IsArray()
	@ValidateNested({ each: true })
	@ApiProperty({type: [ImportBookItem]})
  @IsNotEmpty()
	@Type(() => ImportBookItem)
  data: ImportBookItem[]
}
