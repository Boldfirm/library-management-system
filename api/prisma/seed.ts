import { PrismaClient, Role } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Clearing existing data...');
  await prisma.review.deleteMany();
  await prisma.book.deleteMany();
  await prisma.genre.deleteMany();
  await prisma.user.deleteMany();

  console.log('Seeding 4 Genres...');
  const sciFi = await prisma.genre.create({
    data: { name: 'Science Fiction', slug: 'sci-fi' },
  });

  const fantasy = await prisma.genre.create({
    data: { name: 'Fantasy', slug: 'fantasy' },
  });

  const nonFiction = await prisma.genre.create({
    data: { name: 'Non-Fiction', slug: 'non-fiction' },
  });

  const mystery = await prisma.genre.create({
    data: { name: 'Mystery', slug: 'mystery' },
  });

  console.log('Seeding Users with Roles...');
  const librarian = await prisma.user.create({
    data: {
      name: 'Ada Lovelace',
      email: 'ada.librarian@example.com',
      role: Role.LIBRARIAN,
    },
  });

  const patron = await prisma.user.create({
    data: {
      name: 'Alan Turing',
      email: 'alan.patron@example.com',
      role: Role.PATRON,
    },
  });

  console.log('Seeding 16 Books across 4 Genres...');
  const books = [
    // Science Fiction (4)
    { title: 'Dune', author: 'Frank Herbert', isbn: '9780441172719', totalCopies: 5, availableCopies: 5, genreId: sciFi.id },
    { title: 'Neuromancer', author: 'William Gibson', isbn: '9780441569595', totalCopies: 3, availableCopies: 3, genreId: sciFi.id },
    { title: 'Foundation', author: 'Isaac Asimov', isbn: '9780553293357', totalCopies: 4, availableCopies: 4, genreId: sciFi.id },
    { title: 'Snow Crash', author: 'Neal Stephenson', isbn: '9780553380958', totalCopies: 2, availableCopies: 2, genreId: sciFi.id },

    // Fantasy (4)
    { title: 'The Hobbit', author: 'J.R.R. Tolkien', isbn: '9780547928227', totalCopies: 6, availableCopies: 6, genreId: fantasy.id },
    { title: 'The Name of the Wind', author: 'Patrick Rothfuss', isbn: '9780756404741', totalCopies: 4, availableCopies: 4, genreId: fantasy.id },
    { title: 'A Game of Thrones', author: 'George R.R. Martin', isbn: '9780553103540', totalCopies: 5, availableCopies: 5, genreId: fantasy.id },
    { title: 'The Way of Kings', author: 'Brandon Sanderson', isbn: '9780765326355', totalCopies: 4, availableCopies: 4, genreId: fantasy.id },

    // Non-Fiction (4)
    { title: 'Sapiens: A Brief History of Humankind', author: 'Yuval Noah Harari', isbn: '9780062316097', totalCopies: 4, availableCopies: 4, genreId: nonFiction.id },
    { title: 'Atomic Habits', author: 'James Clear', isbn: '9780735211292', totalCopies: 8, availableCopies: 8, genreId: nonFiction.id },
    { title: 'Thinking, Fast and Slow', author: 'Daniel Kahneman', isbn: '9780374275631', totalCopies: 3, availableCopies: 3, genreId: nonFiction.id },
    { title: 'Clean Code', author: 'Robert C. Martin', isbn: '9780132350884', totalCopies: 5, availableCopies: 5, genreId: nonFiction.id },

    // Mystery (4)
    { title: 'The Hound of the Baskervilles', author: 'Arthur Conan Doyle', isbn: '9780140437867', totalCopies: 4, availableCopies: 4, genreId: mystery.id },
    { title: 'And Then There Were None', author: 'Agatha Christie', isbn: '9780062073488', totalCopies: 6, availableCopies: 6, genreId: mystery.id },
    { title: 'The Girl with the Dragon Tattoo', author: 'Stieg Larsson', isbn: '9780307949486', totalCopies: 3, availableCopies: 3, genreId: mystery.id },
    { title: 'Gone Girl', author: 'Gillian Flynn', isbn: '9780307588371', totalCopies: 4, availableCopies: 4, genreId: mystery.id },
  ];

  for (const book of books) {
    await prisma.book.create({ data: book });
  }

  const sampleBook = await prisma.book.findFirst({ where: { isbn: '9780441172719' } });
  if (sampleBook) {
    await prisma.review.create({
      data: {
        rating: 5,
        comment: 'Masterpiece of science fiction world-building.',
        bookId: sampleBook.id,
        userId: patron.id,
      },
    });
  }

  console.log('Seeded 4 genres, 16 books, users with roles, and sample review successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });