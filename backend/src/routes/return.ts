import { Router } from 'express';

const router = Router();

// POST /api/return - Return a single book
router.post('/', async (req, res) => {
  try {
    // TODO: Implement - return one book copy
    // Expected request body: { bookCopyId }
    res.json({ message: 'Book returned successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to return book' });
  }
});

export default router;
