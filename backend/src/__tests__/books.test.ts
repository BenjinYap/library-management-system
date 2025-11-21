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

  describe('GET /api/books/borrowed', () => {
    it('should return 400 when userId query parameter is missing', async () => {
      const response = await request(app).get('/api/books/borrowed');

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: 'userId query parameter is required' });
    });

    it('should return empty array when user has no borrowed books', async () => {
      prismaMock.bookCopy.findMany.mockResolvedValue([]);

      const response = await request(app).get('/api/books/borrowed?userId=1');

      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });

    it('should return two borrowed books with correct datetimes', async () => {
      const borrowedDate1 = new Date('2025-01-15T10:00:00Z');
      const borrowedDate2 = new Date('2025-01-16T14:30:00Z');

      const mockBorrowedCopies = [
        {
          id: 1,
          bookId: 1,
          currentUserId: 1,
          status: 'BORROWED',
          borrowedDatetime: borrowedDate1,
          book: {
            id: 1,
            title: 'The Great Gatsby',
            author: 'F. Scott Fitzgerald',
          },
        },
        {
          id: 2,
          bookId: 2,
          currentUserId: 1,
          status: 'BORROWED',
          borrowedDatetime: borrowedDate2,
          book: {
            id: 2,
            title: '1984',
            author: 'George Orwell',
          },
        },
      ];

      prismaMock.bookCopy.findMany.mockResolvedValue(mockBorrowedCopies as any);

      const response = await request(app).get('/api/books/borrowed?userId=1');

      expect(response.status).toBe(200);
      expect(response.body).toEqual([
        {
          id: 1,
          title: 'The Great Gatsby',
          author: 'F. Scott Fitzgerald',
          borrowedDatetime: borrowedDate1.toISOString(),
          bookCopyId: 1,
        },
        {
          id: 2,
          title: '1984',
          author: 'George Orwell',
          borrowedDatetime: borrowedDate2.toISOString(),
          bookCopyId: 2,
        },
      ]);
    });
  });
});
