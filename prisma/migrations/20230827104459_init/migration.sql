/*
  Warnings:

  - You are about to drop the column `orderid` on the `CartItemsTBL` table. All the data in the column will be lost.
  - You are about to drop the column `cartitemid` on the `OrderItemsTBL` table. All the data in the column will be lost.
  - Added the required column `itemname` to the `OrderItemsTBL` table without a default value. This is not possible if the table is not empty.
  - Added the required column `itemquantity` to the `OrderItemsTBL` table without a default value. This is not possible if the table is not empty.
  - Added the required column `itemsize` to the `OrderItemsTBL` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "CartItemsTBL" DROP CONSTRAINT "CartItemsTBL_orderid_fkey";

-- DropForeignKey
ALTER TABLE "OrderItemsTBL" DROP CONSTRAINT "OrderItemsTBL_cartitemid_fkey";

-- AlterTable
ALTER TABLE "CartItemsTBL" DROP COLUMN "orderid";

-- AlterTable
ALTER TABLE "OrderItemsTBL" DROP COLUMN "cartitemid",
ADD COLUMN     "itemname" TEXT NOT NULL,
ADD COLUMN     "itemquantity" INTEGER NOT NULL,
ADD COLUMN     "itemsize" TEXT NOT NULL;
