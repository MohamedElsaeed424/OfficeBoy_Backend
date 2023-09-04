/*
  Warnings:

  - You are about to drop the column `itemsize` on the `ItemsTBL` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[itemsize]` on the table `CartItemsTBL` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `itemsize` to the `CartItemsTBL` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "ItemsTBL_itemidescription_key";

-- DropIndex
DROP INDEX "ItemsTBL_itemsize_key";

-- AlterTable
ALTER TABLE "CartItemsTBL" ADD COLUMN     "itemsize" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "ItemsTBL" DROP COLUMN "itemsize";

-- CreateIndex
CREATE UNIQUE INDEX "CartItemsTBL_itemsize_key" ON "CartItemsTBL"("itemsize");
