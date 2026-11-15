import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

@Injectable()
export class BooksService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createBookDto: CreateBookDto) {
    const existingIsbn = await this.prisma.book.findUnique({
      where: { isbn: createBookDto.isbn },
    });
    if (existingIsbn) {
      throw new ConflictException(Book with ISBN '' already exists);
    }

    const genre = await this.prisma.genre.findUnique({
      where: { id: createBookDto.genreId },
    });
    if (!genre) {
      throw new BadRequestException(Genre with ID  does not exist);
    }

    return this.prisma.book.create({
      data: {
        ...createBookDto,
        availableCopies: createBookDto.availableCopies ?? createBookDto.totalCopies,
      },
      include: { genre: true },
    });
  }

  async findAll(genreId?: number, search?: string, page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const take = limit;

    const where = {
      ...(genreId ? { genreId } : {}),
      ...(search
        ? {
            OR: [
              { title: { contains: search, mode: 'insensitive' as const } },
              { author: { contains: search, mode: 'insensitive' as const } },
            ],
          }
        : {}),
    };

    const [data, total] = await Promise.all([
      this.prisma.book.findMany({
        where,
        skip,
        take,
        include: { genre: true },
        orderBy: { id: 'asc' },
      }),
      this.prisma.book.count({ where }),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: number) {
    const book = await this.prisma.book.findUnique({
      where: { id },
      include: { genre: true, reviews: true },
    });
    if (!book) {
      throw new NotFoundException(Book with ID  not found);
    }
    return book;
  }

  async update(id: number, updateBookDto: UpdateBookDto) {
    await this.findOne(id);

    if (updateBookDto.isbn) {
      const existingIsbn = await this.prisma.book.findFirst({
        where: { isbn: updateBookDto.isbn, NOT: { id } },
      });
      if (existingIsbn) {
        throw new ConflictException(Book with ISBN '' already exists);
      }
    }

    if (updateBookDto.genreId) {
      const genre = await this.prisma.genre.findUnique({
        where: { id: updateBookDto.genreId },
      });
      if (!genre) {
        throw new BadRequestException(Genre with ID  does not exist);
      }
    }

    return this.prisma.book.update({
      where: { id },
      data: updateBookDto,
      include: { genre: true },
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.book.delete({ where: { id } });
  }
}