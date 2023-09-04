/*
  Warnings:

  - Added the required column `quanity` to the `CartItemsTBL` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CartItemsTBL" ADD COLUMN     "quanity" INTEGER NOT NULL;
