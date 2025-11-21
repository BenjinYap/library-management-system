import { Router } from 'express';
import { prisma } from '../prisma.js';

const router = Router();

// GET /api/books - Get all books that are available for checkout
// Query params: userId (optional) - if provided, includes borrowed status for that user
router.get('/', async (req, res) => {
  try {
    const userId = req.query.userId ? parseInt(req.query.userId as string) : null;

    const books = await prisma.book.findMany({
      include: {
        bookCopies: true
      }
    });

    // Map books with availability and borrowed status
    const availableBooks = books
      .filter(book => book.bookCopies.some(copy => copy.status === 'AVAILABLE'))
      .map(book => {
        const availableCopies = book.bookCopies.filter(copy => copy.status === 'AVAILABLE').length;
        const borrowedByUser = userId
          ? book.bookCopies.some(copy => copy.currentUserId === userId && copy.status === 'BORROWED')
          : false;

        return {
          id: book.id,
          title: book.title,
          author: book.author,
          publishDate: book.publishDate,
          availableCopies,
          borrowedByUser
        };
      });

    res.json(availableBooks);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch books' });
  }
});

export default router;
