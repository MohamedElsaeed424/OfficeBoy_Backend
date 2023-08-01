/*
  Warnings:

  - You are about to drop the column `itemid` on the `CartItemsTBL` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "CartItemsTBL_itemid_key";

-- AlterTable
ALTER TABLE "CartItemsTBL" DROP COLUMN "itemid";
