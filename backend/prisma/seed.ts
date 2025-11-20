import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const BOOKS_DATA = [
  {
    title: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    publishDate: new Date('1960-07-11'),
    copies: 3
  },
  {
    title: '1984',
    author: 'George Orwell',
    publishDate: new Date('1949-06-08'),
    copies: 2
  },
  {
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    publishDate: new Date('1925-04-10'),
    copies: 2
  },
  {
    title: 'Pride and Prejudice',
    author: 'Jane Austen',
    publishDate: new Date('1813-01-28'),
    copies: 1
  },
  {
    title: 'The Catcher in the Rye',
    author: 'J.D. Salinger',
    publishDate: new Date('1951-07-16'),
    copies: 2
  },
  {
    title: 'The Lord of the Rings',
    author: 'J.R.R. Tolkien',
    publishDate: new Date('1954-07-29'),
    copies: 3
  },
  {
    title: 'Harry Potter and the Philosopher\'s Stone',
    author: 'J.K. Rowling',
    publishDate: new Date('1997-06-26'),
    copies: 3
  },
  {
    title: 'The Hobbit',
    author: 'J.R.R. Tolkien',
    publishDate: new Date('1937-09-21'),
    copies: 2
  },
  {
    title: 'Fahrenheit 451',
    author: 'Ray Bradbury',
    publishDate: new Date('1953-10-19'),
    copies: 1
  },
  {
    title: 'Brave New World',
    author: 'Aldous Huxley',
    publishDate: new Date('1932-08-18'),
    copies: 2
  }
];

async function main() {
  console.log('🌱 Starting database seed...\n');

  // Clear existing data
  console.log('Clearing existing data...');
  await prisma.bookCopyLendingHistory.deleteMany();
  await prisma.bookCopy.deleteMany();
  await prisma.book.deleteMany();
  await prisma.user.deleteMany();
  console.log('✓ Cleared existing data\n');

  // Create user
  console.log('Creating user...');
  const user = await prisma.user.create({
    data: {
      fullName: 'Benjin'
    }
  });
  console.log(`✓ Created user: ${user.fullName} (ID: ${user.id})\n`);

  // Create books with copies
  console.log('Creating books and copies...');
  let totalCopies = 0;

  for (const bookData of BOOKS_DATA) {
    const { copies, ...bookInfo } = bookData;

    const book = await prisma.book.create({
      data: bookInfo
    });

    // Create the specified number of copies for this book
    const bookCopies = [];
    for (let i = 0; i < copies; i++) {
      bookCopies.push({
        bookId: book.id,
        status: 'AVAILABLE' as const
      });
    }

    await prisma.bookCopy.createMany({
      data: bookCopies
    });

    totalCopies += copies;
    console.log(`✓ Created "${book.title}" by ${book.author} with ${copies} ${copies === 1 ? 'copy' : 'copies'}`);
  }

  console.log(`\n✅ Seed completed successfully!`);
  console.log(`   - Created 1 user`);
  console.log(`   - Created ${BOOKS_DATA.length} books`);
  console.log(`   - Created ${totalCopies} book copies`);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
