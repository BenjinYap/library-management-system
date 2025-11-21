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
    it('should return an array of books with available copies', async () => {
      // Arrange: Mock the Prisma query
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
        {
          id: 2,
          title: '1984',
          author: 'George Orwell',
          bookCopies: [
            {
              id: 3,
              bookId: 2,
              status: 'AVAILABLE',
              currentUserId: null,
            },
          ],
        },
      ];

      prismaMock.book.findMany.mockResolvedValue(mockBooks as any);

      // Act: Make the request
      const response = await request(app).get('/api/books');

      // Assert: Verify the response
      expect(response.status).toBe(200);
      expect(response.body).toEqual([
        {
          id: 1,
          title: 'The Great Gatsby',
          author: 'F. Scott Fitzgerald',
          availableCopies: 2,
        },
        {
          id: 2,
          title: '1984',
          author: 'George Orwell',
          availableCopies: 1,
        },
      ]);
    });

    it('should return an empty array when no books are available', async () => {
      // Arrange: Mock an empty result
      prismaMock.book.findMany.mockResolvedValue([]);

      // Act: Make the request
      const response = await request(app).get('/api/books');

      // Assert: Verify the response
      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });

    it('should filter out books with no available copies', async () => {
      // Arrange: Mock books where some have no available copies
      const mockBooks = [
        {
          id: 1,
          title: 'Available Book',
          author: 'Author One',
          bookCopies: [
            {
              id: 1,
              bookId: 1,
              status: 'AVAILABLE',
              currentUserId: null,
            },
          ],
        },
        {
          id: 2,
          title: 'Book with No Available Copies',
          author: 'Author Two',
          bookCopies: [], // No available copies
        },
      ];

      prismaMock.book.findMany.mockResolvedValue(mockBooks as any);

      // Act: Make the request
      const response = await request(app).get('/api/books');

      // Assert: Verify only books with available copies are returned
      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(1);
      expect(response.body[0].title).toBe('Available Book');
    });

    it('should return 500 when database error occurs', async () => {
      // Arrange: Mock a database error
      prismaMock.book.findMany.mockRejectedValue(new Error('Database connection failed'));

      // Act: Make the request
      const response = await request(app).get('/api/books');

      // Assert: Verify error handling
      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: 'Failed to fetch books' });
    });
  });
});
