import { Router } from 'express';

const router = Router();

// POST /api/book-copies - Create a new book copy
router.post('/', async (req, res) => {
  try {
    const { bookId } = req.body;
    // TODO: Implement with Prisma
    res.status(201).json({ message: 'Book copy created' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create book copy' });
  }
});

// POST /api/book-copies/:id/borrow - Borrow a book copy
router.post('/:id/borrow', async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;
    // TODO: Implement with Prisma
    // 1. Update book copy status to BORROWED
    // 2. Set currentUserId
    // 3. Create lending history entry with action BORROWED
    res.json({ message: `Book copy ${id} borrowed by user ${userId}` });
  } catch (error) {
    res.status(500).json({ error: 'Failed to borrow book copy' });
  }
});

// POST /api/book-copies/:id/return - Return a book copy
router.post('/:id/return', async (req, res) => {
  try {
    const { id } = req.params;
    // TODO: Implement with Prisma
    // 1. Update book copy status to AVAILABLE
    // 2. Clear currentUserId
    // 3. Create lending history entry with action RETURNED
    res.json({ message: `Book copy ${id} returned` });
  } catch (error) {
    res.status(500).json({ error: 'Failed to return book copy' });
  }
});

export default router;
