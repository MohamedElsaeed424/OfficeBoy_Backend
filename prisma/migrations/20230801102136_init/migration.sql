/*
  Warnings:

  - You are about to drop the column `itemid` on the `CartTBL` table. All the data in the column will be lost.
  - Added the required column `cartid` to the `ItemsTBL` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "CartTBL" DROP CONSTRAINT "CartTBL_itemid_fkey";

-- AlterTable
ALTER TABLE "CartTBL" DROP COLUMN "itemid";

-- AlterTable
ALTER TABLE "ItemsTBL" ADD COLUMN     "cartid" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "ItemsTBL" ADD CONSTRAINT "ItemsTBL_cartid_fkey" FOREIGN KEY ("cartid") REFERENCES "CartTBL"("cartid") ON DELETE RESTRICT ON UPDATE CASCADE;
