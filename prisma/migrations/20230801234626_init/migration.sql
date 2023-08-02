/*
  Warnings:

  - You are about to drop the column `orderid` on the `CartItemsTBL` table. All the data in the column will be lost.
  - Added the required column `orderid` to the `CartTBL` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "CartItemsTBL" DROP CONSTRAINT "CartItemsTBL_orderid_fkey";

-- AlterTable
ALTER TABLE "CartItemsTBL" DROP COLUMN "orderid";

-- AlterTable
ALTER TABLE "CartTBL" ADD COLUMN     "orderid" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "CartTBL" ADD CONSTRAINT "CartTBL_orderid_fkey" FOREIGN KEY ("orderid") REFERENCES "OrdersTBL"("orderid") ON DELETE RESTRICT ON UPDATE CASCADE;
