/*
  Warnings:

  - You are about to drop the column `cartid` on the `ItemsTBL` table. All the data in the column will be lost.
  - Added the required column `itemid` to the `CartTBL` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ItemsTBL" DROP CONSTRAINT "ItemsTBL_cartid_fkey";

-- AlterTable
ALTER TABLE "CartTBL" ADD COLUMN     "itemid" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "ItemsTBL" DROP COLUMN "cartid";

-- AddForeignKey
ALTER TABLE "CartTBL" ADD CONSTRAINT "CartTBL_itemid_fkey" FOREIGN KEY ("itemid") REFERENCES "ItemsTBL"("itemid") ON DELETE RESTRICT ON UPDATE CASCADE;
