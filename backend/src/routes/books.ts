import { Router } from 'express';
import { prisma } from '../prisma.js';

const router = Router();

// GET /api/books - Get all books that are available for checkout
router.get('/', async (req, res) => {
  try {
    const books = await prisma.book.findMany({
      include: {
        bookCopies: {
          where: {
            status: 'AVAILABLE'
          }
        }
      }
    });

    // Filter to only include books with at least one available copy
    const availableBooks = books
      .filter(book => book.bookCopies.length > 0)
      .map(book => ({
        id: book.id,
        title: book.title,
        author: book.author,
        publishDate: book.publishDate,
        availableCopies: book.bookCopies.length
      }));

    res.json(availableBooks);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch books' });
  }
});

export default router;
