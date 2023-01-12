import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';
import { CreateCustomerDto } from './create-customer.dto';

export class EditCustomerDto extends CreateCustomerDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Transform((value: any) => value.trim(), { toPlainOnly: true })
  reason: string;
}
