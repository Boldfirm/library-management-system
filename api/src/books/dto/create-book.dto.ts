import { IsString, IsInt, IsOptional, Min, IsNotEmpty } from 'class-validator';

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

  @IsOptional()
  @IsString()
  coverImage?: string;

  @IsInt()
  @Min(1)
  totalCopies: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  availableCopies?: number;

  @IsInt()
  genreId: number;
}