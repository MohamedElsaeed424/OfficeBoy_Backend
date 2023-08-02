/*
  Warnings:

  - You are about to drop the column `quanity` on the `CartItemsTBL` table. All the data in the column will be lost.
  - You are about to drop the column `orderid` on the `CartTBL` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "CartTBL" DROP CONSTRAINT "CartTBL_orderid_fkey";

-- AlterTable
ALTER TABLE "CartItemsTBL" DROP COLUMN "quanity";

-- AlterTable
ALTER TABLE "CartTBL" DROP COLUMN "orderid";
