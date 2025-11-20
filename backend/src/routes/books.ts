import { Router } from 'express';

const router = Router();

// GET /api/books - Get all books that are available for checkout
router.get('/', async (req, res) => {
  try {
    // TODO: Implement - return all books with at least one available copy
    res.json([]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch books' });
  }
});

export default router;
