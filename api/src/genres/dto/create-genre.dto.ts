import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateGenreDto {
  @ApiProperty({ example: 'Science Fiction', description: 'Genre display name' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'sci-fi', description: 'URL-friendly unique slug' })
  @IsString()
  @IsNotEmpty()
  slug: string;
}