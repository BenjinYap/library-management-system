import { Router } from 'express';
import { prisma } from '../prisma.js';

const router = Router();

// GET /api/books - Get all books that are available for checkout
router.get('/', async (req, res) => {
  try {
    const books = await prisma.book.findMany({
      include: {
        bookCopies: true
      }
    });

    // Map books with availability
    const availableBooks = books
      .filter(book => book.bookCopies.some(copy => copy.status === 'AVAILABLE'))
      .map(book => {
        const availableCopies = book.bookCopies.filter(copy => copy.status === 'AVAILABLE').length;

        return {
          id: book.id,
          title: book.title,
          author: book.author,
          availableCopies
        };
      });

    res.json(availableBooks);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch books' });
  }
});

// GET /api/books/:bookId/borrowed-info - Get borrowed book info with datetime
// Query params: userId (required) - the user who borrowed the book
router.get('/:bookId/borrowed-info', async (req, res) => {
  try {
    const bookId = parseInt(req.params.bookId);
    const userId = req.query.userId ? parseInt(req.query.userId as string) : null;

    if (!userId) {
      return res.status(400).json({ error: 'userId query parameter is required' });
    }

    // Find the book
    const book = await prisma.book.findUnique({
      where: { id: bookId }
    });

    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }

    // Find the borrowed copy by this user
    const borrowedCopy = await prisma.bookCopy.findFirst({
      where: {
        bookId: bookId,
        currentUserId: userId,
        status: 'BORROWED'
      }
    });

    if (!borrowedCopy) {
      return res.status(404).json({ error: 'No borrowed copy found for this user' });
    }

    // Find the most recent BORROWED action for this copy and user
    const borrowedHistory = await prisma.bookCopyLendingHistory.findFirst({
      where: {
        bookCopyId: borrowedCopy.id,
        userId: userId,
        action: 'BORROWED'
      },
      orderBy: {
        datetime: 'desc'
      }
    });

    res.json({
      id: book.id,
      title: book.title,
      author: book.author,
      borrowedDatetime: borrowedHistory?.datetime || null,
      bookCopyId: borrowedCopy.id
    });
  } catch (error) {
    console.error('Error fetching borrowed book info:', error);
    res.status(500).json({ error: 'Failed to fetch borrowed book info' });
  }
});

export default router;
