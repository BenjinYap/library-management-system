import { Router } from 'express';
import { prisma } from '../prisma.js';

const router = Router();

// POST /api/checkout - Checkout a single book
router.post('/', async (req, res) => {
  try {
    const { bookId, userId } = req.body;

    // Validate input
    if (!bookId || !userId) {
      return res.status(400).json({ error: 'bookId and userId are required' });
    }

    // Check if user already has this specific book checked out
    const existingBorrow = await prisma.bookCopy.findFirst({
      where: {
        bookId: parseInt(bookId),
        currentUserId: parseInt(userId),
        status: 'BORROWED'
      }
    });

    if (existingBorrow) {
      return res.status(400).json({ error: 'You already have a copy of this book checked out. Please return it before checking out another copy.' });
    }

    // Find the first available copy of the book
    const availableCopy = await prisma.bookCopy.findFirst({
      where: {
        bookId: parseInt(bookId),
        status: 'AVAILABLE'
      }
    });

    if (!availableCopy) {
      return res.status(404).json({ error: 'No available copies of this book' });
    }

    // Update the copy to borrowed, but only if it's still available
    // This prevents race conditions at the SQL level
    const updateResult = await prisma.bookCopy.updateMany({
      where: {
        id: availableCopy.id,
        status: 'AVAILABLE' // Only update if still available
      },
      data: {
        status: 'BORROWED',
        currentUserId: parseInt(userId)
      }
    });

    // If no rows were updated, another request beat us to it
    if (updateResult.count === 0) {
      return res.status(409).json({ error: 'Book copy was already checked out by another user' });
    }

    // Create a lending history record
    await prisma.bookCopyLendingHistory.create({
      data: {
        bookCopyId: availableCopy.id,
        userId: parseInt(userId),
        action: 'BORROWED'
      }
    });

    res.json({
      message: 'Book checked out successfully',
      bookCopyId: availableCopy.id
    });
  } catch (error) {
    console.error('Checkout error:', error);
    res.status(500).json({ error: 'Failed to checkout book' });
  }
});

export default router;
