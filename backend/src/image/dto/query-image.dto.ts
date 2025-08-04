import { ApiPropertyOptional } from '@nestjs/swagger';

export class QueryImageDto {
  @ApiPropertyOptional({
    example: 1,
    description: 'Page number',
  })
  page?: number;

  @ApiPropertyOptional({
    example: 10,
    description: 'Items per page',
  })
  limit?: number;

  @ApiPropertyOptional({
    example: 'cat',
    description: 'Filter by title substring',
  })
  filter?: string;

  @ApiPropertyOptional({
    example: 'title',
    description: 'Order by field',
  })
  orderBy?: string;

  @ApiPropertyOptional({
    example: 'asc',
    description: 'Order direction',
  })
  order?: 'asc' | 'desc';
}
