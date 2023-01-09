import { IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCustomerDto {
  @ApiProperty({
    description: 'The party ID of the customer',
    example: '123456',
  })
  @IsNotEmpty()
  partyId: string;

  @ApiProperty({
    description: 'The name of the customer',
    example: 'John Smith',
  })
  @IsOptional()
  customerName: string;

  @ApiProperty({
    description: 'The phone number of the customer',
    example: '123-456-7890',
  })
  @IsOptional()
  customerPhone: string;

  @ApiProperty({
    description: 'The name of the guest',
    example: 'Jane Smith',
  })
  @IsOptional()
  guestName: string;

  @ApiProperty({
    description: 'The status of the customer',
    example: 1,
  })
  @IsOptional()
  status: number;

  @ApiProperty({
    description: 'The created at timestamp of the customer',
    example: 1605226853,
  })
  @IsOptional()
  createdAt: number;

  @ApiProperty({
    description: 'The updated at timestamp of the customer',
    example: 1605226853,
  })
  @IsOptional()
  updatedAt: number;

  @ApiProperty({
    description: 'The ID of the user who created the customer',
    example: 1,
  })
  @IsOptional()
  createdBy: number;

  @ApiProperty({
    description: 'The ID of the user who updated the customer',
    example: 1,
  })
  @IsOptional()
  updatedBy: number;

  @ApiProperty({
    description: 'Whether the customer is a topup',
    example: false,
  })
  @IsOptional()
  isTopup: boolean;

  @ApiProperty({
    description: 'The phone number of the guest',
    example: '123-456-7890',
  })
  @IsOptional()
  guestPhone: string;

  @ApiProperty({
    description: 'The turn count of the customer',
    example: 1,
  })
  @IsOptional()
  turnCount: number;

  @ApiProperty({
    description: 'Whether the customer is a bivina',
    example: false,
  })
  @IsOptional()
  isBivina: boolean;
}
