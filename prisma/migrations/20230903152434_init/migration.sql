/*
  Warnings:

  - You are about to drop the column `upcomingitemid` on the `OrderItemsTBL` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "OrderItemsTBL" DROP CONSTRAINT "OrderItemsTBL_upcomingitemid_fkey";

-- AlterTable
ALTER TABLE "OrderItemsTBL" DROP COLUMN "upcomingitemid";
