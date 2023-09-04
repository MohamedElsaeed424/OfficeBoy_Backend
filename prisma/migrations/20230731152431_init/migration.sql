/*
  Warnings:

  - You are about to drop the `OrderItemsTBL` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `cartid` to the `ItemsTBL` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "OrderItemsTBL" DROP CONSTRAINT "OrderItemsTBL_cartid_fkey";

-- DropForeignKey
ALTER TABLE "OrderItemsTBL" DROP CONSTRAINT "OrderItemsTBL_orderid_fkey";

-- AlterTable
ALTER TABLE "ItemsTBL" ADD COLUMN     "cartid" INTEGER NOT NULL;

-- DropTable
DROP TABLE "OrderItemsTBL";

-- CreateTable
CREATE TABLE "CartItemsTBL" (
    "cartid" SERIAL NOT NULL,
    "itemid" INTEGER NOT NULL,
    "quanity" INTEGER NOT NULL,
    "orderid" INTEGER NOT NULL,

    CONSTRAINT "CartItemsTBL_pkey" PRIMARY KEY ("cartid")
);

-- CreateIndex
CREATE UNIQUE INDEX "CartItemsTBL_cartid_key" ON "CartItemsTBL"("cartid");

-- CreateIndex
CREATE UNIQUE INDEX "CartItemsTBL_itemid_key" ON "CartItemsTBL"("itemid");

-- AddForeignKey
ALTER TABLE "ItemsTBL" ADD CONSTRAINT "ItemsTBL_cartid_fkey" FOREIGN KEY ("cartid") REFERENCES "CartTBL"("cartid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CartItemsTBL" ADD CONSTRAINT "CartItemsTBL_orderid_fkey" FOREIGN KEY ("orderid") REFERENCES "OrdersTBL"("orderid") ON DELETE RESTRICT ON UPDATE CASCADE;
