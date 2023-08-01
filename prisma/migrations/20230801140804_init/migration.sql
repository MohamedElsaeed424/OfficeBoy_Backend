/*
  Warnings:

  - Added the required column `itemid` to the `CartItemsTBL` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CartItemsTBL" ADD COLUMN     "itemid" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "CartItemsTBL" ADD CONSTRAINT "CartItemsTBL_itemid_fkey" FOREIGN KEY ("itemid") REFERENCES "ItemsTBL"("itemid") ON DELETE RESTRICT ON UPDATE CASCADE;
