import { Router } from 'express';

const router = Router();

// POST /api/checkout - Checkout a single book
router.post('/', async (req, res) => {
  try {
    // TODO: Implement - checkout one book copy
    // Expected request body: { bookId, userId }
    res.json({ message: 'Book checked out successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to checkout book' });
  }
});

export default router;
