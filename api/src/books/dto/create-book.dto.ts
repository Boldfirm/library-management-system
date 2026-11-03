import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsISBN, IsNotEmpty, IsOptional, IsPositive, IsString, Min } from 'class-validator';

export class CreateBookDto {
  @ApiProperty({ example: 'Dune', description: 'Title of the book' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'Frank Herbert', description: 'Author name' })
  @IsString()
  @IsNotEmpty()
  author: string;

  @ApiProperty({ example: '9780441172719', description: 'Standard 10 or 13-digit ISBN' })
  @IsISBN()
  @IsNotEmpty()
  isbn: string;

  @ApiPropertyOptional({ example: 5, description: 'Total physical copies owned', default: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  totalCopies?: number;

  @ApiPropertyOptional({ example: 5, description: 'Copies currently available on shelf', default: 1 })
  @IsOptional()
  @IsInt()
  @Min(0)
  availableCopies?: number;

  @ApiProperty({ example: 1, description: 'Foreign key ID linking to a Genre' })
  @IsInt()
  @IsPositive()
  genreId: number;
}