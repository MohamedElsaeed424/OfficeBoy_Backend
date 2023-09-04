/*
  Warnings:

  - You are about to drop the column `itemname` on the `OrderItemsTBL` table. All the data in the column will be lost.
  - You are about to drop the column `itemquantity` on the `OrderItemsTBL` table. All the data in the column will be lost.
  - You are about to drop the column `sizeid` on the `OrderItemsTBL` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[orderitemid]` on the table `UpcomingItemsTBL` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `orderitemid` to the `UpcomingItemsTBL` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "OrderItemsTBL" DROP CONSTRAINT "OrderItemsTBL_sizeid_fkey";

-- AlterTable
ALTER TABLE "OrderItemsTBL" DROP COLUMN "itemname",
DROP COLUMN "itemquantity",
DROP COLUMN "sizeid";

-- AlterTable
ALTER TABLE "UpcomingItemsTBL" ADD COLUMN     "orderitemid" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "OrderItemsDataTBL" (
    "orderitemsdataid" SERIAL NOT NULL,
    "itemname" TEXT NOT NULL,
    "itemquantity" INTEGER NOT NULL,
    "sizeid" INTEGER NOT NULL,
    "orderitemid" INTEGER NOT NULL,

    CONSTRAINT "OrderItemsDataTBL_pkey" PRIMARY KEY ("orderitemsdataid")
);

-- CreateIndex
CREATE UNIQUE INDEX "OrderItemsDataTBL_orderitemsdataid_key" ON "OrderItemsDataTBL"("orderitemsdataid");

-- CreateIndex
CREATE UNIQUE INDEX "UpcomingItemsTBL_orderitemid_key" ON "UpcomingItemsTBL"("orderitemid");

-- AddForeignKey
ALTER TABLE "UpcomingItemsTBL" ADD CONSTRAINT "UpcomingItemsTBL_orderitemid_fkey" FOREIGN KEY ("orderitemid") REFERENCES "OrderItemsTBL"("orderitemid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItemsDataTBL" ADD CONSTRAINT "OrderItemsDataTBL_sizeid_fkey" FOREIGN KEY ("sizeid") REFERENCES "SizeTBL"("sizeid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItemsDataTBL" ADD CONSTRAINT "OrderItemsDataTBL_orderitemid_fkey" FOREIGN KEY ("orderitemid") REFERENCES "OrderItemsTBL"("orderitemid") ON DELETE RESTRICT ON UPDATE CASCADE;
