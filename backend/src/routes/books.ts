import { Router } from 'express';

const router = Router();

// GET /api/books - Get all books with available copies count
router.get('/', async (req, res) => {
  try {
    // TODO: Implement with Prisma
    res.json([]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch books' });
  }
});

// GET /api/books/:id - Get a specific book with all its copies
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    // TODO: Implement with Prisma
    res.json({ message: `Get book ${id}` });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch book' });
  }
});

// POST /api/books - Create a new book
router.post('/', async (req, res) => {
  try {
    const { title, author, publishDate } = req.body;
    // TODO: Implement with Prisma
    res.status(201).json({ message: 'Book created' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create book' });
  }
});

export default router;
