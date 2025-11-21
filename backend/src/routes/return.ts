import { Router } from 'express';
import { prisma } from '../prisma.js';

const router = Router();

// POST /api/return - Return a single book
router.post('/', async (req, res) => {
  try {
    const { bookId, userId } = req.body;

    // Validate input
    if (!bookId || !userId) {
      return res.status(400).json({ error: 'bookId and userId are required' });
    }

    // Find a borrowed copy of the book by the current user
    const borrowedCopy = await prisma.bookCopy.findFirst({
      where: {
        bookId: parseInt(bookId),
        currentUserId: parseInt(userId),
        status: 'BORROWED'
      }
    });

    if (!borrowedCopy) {
      return res.status(404).json({ error: 'No borrowed copies of this book found for this user' });
    }

    // Update the copy to available, but only if it's still borrowed by this user
    // This prevents race conditions at the SQL level
    const updateResult = await prisma.bookCopy.updateMany({
      where: {
        id: borrowedCopy.id,
        currentUserId: parseInt(userId),
        status: 'BORROWED' // Only update if still borrowed by this user
      },
      data: {
        status: 'AVAILABLE',
        currentUserId: null,
        borrowedDatetime: null
      }
    });

    // If no rows were updated, another request beat us to it
    if (updateResult.count === 0) {
      return res.status(409).json({ error: 'Book copy was already returned' });
    }

    // Create a lending history record
    await prisma.bookCopyLendingHistory.create({
      data: {
        bookCopyId: borrowedCopy.id,
        userId: parseInt(userId),
        action: 'RETURNED'
      }
    });

    res.json({
      message: 'Book returned successfully',
      bookCopyId: borrowedCopy.id
    });
  } catch (error) {
    console.error('Return error:', error);
    res.status(500).json({ error: 'Failed to return book' });
  }
});

export default router;
