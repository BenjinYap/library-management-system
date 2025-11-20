import { beforeEach } from '@jest/globals';
import { mockReset } from 'jest-mock-extended';
import { prismaMock } from './prisma-mock.js';

beforeEach(() => {
  mockReset(prismaMock);
});
