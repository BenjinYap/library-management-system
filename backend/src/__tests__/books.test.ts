import { describe, it, expect, beforeAll } from '@jest/globals';
import request from 'supertest';
import express, { Express } from 'express';
import { prismaMock } from './prisma-mock.js';

describe('Books API', () => {
  let app: Express;

  beforeAll(async () => {
    // Dynamically import the books router after mocking is set up
    const booksModule = await import('../routes/books.js');

    // Set up a minimal Express app for testing
    app = express();
    app.use(express.json());
    app.use('/api/books', booksModule.default);
  });

  describe('GET /api/books', () => {
    it('should return a book that is available', async () => {
      const mockBooks = [
        {
          id: 1,
          title: 'The Great Gatsby',
          author: 'F. Scott Fitzgerald',
          bookCopies: [
            {
              id: 1,
              bookId: 1,
              status: 'AVAILABLE',
              currentUserId: null,
            },
            {
              id: 2,
              bookId: 1,
              status: 'AVAILABLE',
              currentUserId: null,
            },
          ],
        },
      ];

      prismaMock.book.findMany.mockResolvedValue(mockBooks as any);

      const response = await request(app).get('/api/books');

      expect(response.status).toBe(200);
      expect(response.body[0]).toEqual({
        id: 1,
        title: 'The Great Gatsby',
        author: 'F. Scott Fitzgerald',
        availableCopies: 2,
      });
    });

    it('should return no results when there are books but none are available', async () => {
      const mockBooks = [
        {
          id: 1,
          title: 'The Great Gatsby',
          author: 'F. Scott Fitzgerald',
          bookCopies: [],
        },
      ];

      prismaMock.book.findMany.mockResolvedValue(mockBooks as any);

      const response = await request(app).get('/api/books');

      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });
  });
});
