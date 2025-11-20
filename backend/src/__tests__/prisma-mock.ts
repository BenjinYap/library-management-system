import { PrismaClient } from '@prisma/client';
import { mockDeep, mockReset, DeepMockProxy } from 'jest-mock-extended';

import { jest } from '@jest/globals';

// Create a deep mock of PrismaClient
export const prismaMock = mockDeep<PrismaClient>() as unknown as DeepMockProxy<PrismaClient>;

// Mock the @prisma/client module
jest.unstable_mockModule('@prisma/client', () => ({
  PrismaClient: jest.fn(() => prismaMock),
}));
