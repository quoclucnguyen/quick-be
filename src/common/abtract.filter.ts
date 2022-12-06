import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class AbstractFilter {
  @Transform(({ obj, key }) => obj[key] === 'true')
  @ApiProperty({ required: false })
  isActive: boolean | null;

  @Transform(({ obj, key }) => obj[key] === 'true')
  @ApiProperty({ required: false })
  isWebQuery: boolean | null;

  @ApiProperty({ required: false })
  createdBy: number | null;

  @ApiProperty({ required: false })
  updatedBy: number | null;

  @ApiProperty({ required: false, default: 0 })
  take: number | null = 0;

  @ApiProperty({ required: false, default: 0 })
  skip: number | null = 0;

  @ApiProperty({ required: false })
  id: number | null;

  whereProperties: string[] = [];
  whereWithLikeProperties: string[] = [];

  setWhereConditions(conditions: string[]) {
    this.whereProperties = [
      ...conditions,
      ...Object.values(this.whereProperties ?? []),
    ];
  }

  setWhereWithLikeConditions(conditions: string[]) {
    this.whereWithLikeProperties = [
      ...conditions,
      ...Object.values(this.whereWithLikeProperties ?? []),
    ];
  }

  constructor() {
    this.setWhereConditions(['isActive', 'createdBy', 'updatedBy', 'id']);
    this.setWhereWithLikeConditions([]);
  }
}
