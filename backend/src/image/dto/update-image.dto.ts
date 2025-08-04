import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateImageDto {
  @ApiPropertyOptional({
    example: 'New title',
    description: 'Image title',
  })
  title?: string;

  @ApiPropertyOptional({
    example: 'New description',
    description: 'Image description',
  })
  description?: string;
}
