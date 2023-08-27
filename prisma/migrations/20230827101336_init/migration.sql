/*
  Warnings:

  - You are about to drop the column `itemid` on the `OrdersTBL` table. All the data in the column will be lost.
  - You are about to drop the column `officeid` on the `OrdersTBL` table. All the data in the column will be lost.
  - You are about to drop the column `roomid` on the `OrdersTBL` table. All the data in the column will be lost.
  - Added the required column `orderid` to the `CartItemsTBL` table without a default value. This is not possible if the table is not empty.
  - Added the required column `empid` to the `OrdersTBL` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "OrdersTBL" DROP CONSTRAINT "OrdersTBL_itemid_fkey";

-- DropForeignKey
ALTER TABLE "OrdersTBL" DROP CONSTRAINT "OrdersTBL_officeid_fkey";

-- DropForeignKey
ALTER TABLE "OrdersTBL" DROP CONSTRAINT "OrdersTBL_roomid_fkey";

-- AlterTable
ALTER TABLE "CartItemsTBL" ADD COLUMN     "orderid" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "OrdersTBL" DROP COLUMN "itemid",
DROP COLUMN "officeid",
DROP COLUMN "roomid",
ADD COLUMN     "empid" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "OrderItemsTBL" (
    "orderitemid" SERIAL NOT NULL,
    "orderid" INTEGER NOT NULL,
    "cartitemid" INTEGER NOT NULL,

    CONSTRAINT "OrderItemsTBL_pkey" PRIMARY KEY ("orderitemid")
);

-- CreateIndex
CREATE UNIQUE INDEX "OrderItemsTBL_orderitemid_key" ON "OrderItemsTBL"("orderitemid");

-- AddForeignKey
ALTER TABLE "OrdersTBL" ADD CONSTRAINT "OrdersTBL_empid_fkey" FOREIGN KEY ("empid") REFERENCES "EmployeeTBL"("empid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItemsTBL" ADD CONSTRAINT "OrderItemsTBL_orderid_fkey" FOREIGN KEY ("orderid") REFERENCES "OrdersTBL"("orderid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItemsTBL" ADD CONSTRAINT "OrderItemsTBL_cartitemid_fkey" FOREIGN KEY ("cartitemid") REFERENCES "CartItemsTBL"("cartitemid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CartItemsTBL" ADD CONSTRAINT "CartItemsTBL_orderid_fkey" FOREIGN KEY ("orderid") REFERENCES "OrdersTBL"("orderid") ON DELETE RESTRICT ON UPDATE CASCADE;
