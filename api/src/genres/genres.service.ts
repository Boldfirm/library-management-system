import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateGenreDto } from './dto/create-genre.dto';
import { UpdateGenreDto } from './dto/update-genre.dto';

@Injectable()
export class GenresService {
  constructor(private readonly prisma: PrismaService) {}

  private generateSlug(name: string): string {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  async create(createGenreDto: CreateGenreDto) {
    const slug = createGenreDto.slug || this.generateSlug(createGenreDto.name);

    const existing = await this.prisma.genre.findFirst({
      where: {
        OR: [{ name: createGenreDto.name }, { slug }],
      },
    });
    if (existing) {
      throw new ConflictException(`Genre '${createGenreDto.name}' or slug '${slug}' already exists`);
    }

    return this.prisma.genre.create({
      data: {
        name: createGenreDto.name,
        slug,
      },
    });
  }

  async findAll() {
    return this.prisma.genre.findMany({
      include: {
        _count: {
          select: { books: true },
        },
      },
    });
  }

  async findOne(id: number) {
    const genre = await this.prisma.genre.findUnique({
      where: { id },
      include: { books: true },
    });
    if (!genre) {
      throw new NotFoundException(`Genre with ID ${id} not found`);
    }
    return genre;
  }

  async update(id: number, updateGenreDto: UpdateGenreDto) {
    await this.findOne(id);
    const data: { name?: string; slug?: string } = { ...updateGenreDto };
    if (updateGenreDto.name && !updateGenreDto.slug) {
      data.slug = this.generateSlug(updateGenreDto.name);
    }
    return this.prisma.genre.update({
      where: { id },
      data,
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.genre.delete({
      where: { id },
    });
  }
}
