import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CreateBookDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  author: string;

  @IsString()
  @IsNotEmpty()
  isbn: string;

  @IsInt()
  @Min(1)
  @IsOptional()
  publishedYear?: number;

  @IsInt()
  @Min(0)
  @IsOptional()
  availableCopies?: number;

  @IsInt()
  @IsNotEmpty()
  genreId: number;
}
