import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateImageDto {
  @ApiProperty({
    example: 'My image',
    description: 'Image title',
  })
  title: string;

  @ApiPropertyOptional({
    example: 'A description',
    description: 'Image description',
  })
  description?: string;

  @ApiPropertyOptional({
    example: true,
    description: 'Crop/resize image to square proportion',
  })
  square?: boolean;
}
