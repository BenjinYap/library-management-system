/*
  Warnings:

  - You are about to drop the column `createdAt` on the `book_copies` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `book_copies` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `books` table. All the data in the column will be lost.
  - You are about to drop the column `publishDate` on the `books` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `books` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `book_copies` DROP COLUMN `createdAt`,
    DROP COLUMN `updatedAt`;

-- AlterTable
ALTER TABLE `books` DROP COLUMN `createdAt`,
    DROP COLUMN `publishDate`,
    DROP COLUMN `updatedAt`;

-- AlterTable
ALTER TABLE `users` DROP COLUMN `createdAt`,
    DROP COLUMN `updatedAt`;
