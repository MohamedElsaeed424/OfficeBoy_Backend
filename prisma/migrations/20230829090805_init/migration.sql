/*
  Warnings:

  - You are about to drop the column `itemsize` on the `CartItemsTBL` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "CartItemsTBL_itemsize_key";

-- AlterTable
ALTER TABLE "CartItemsTBL" DROP COLUMN "itemsize";
