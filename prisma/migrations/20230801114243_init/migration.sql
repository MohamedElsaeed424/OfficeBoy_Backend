/*
  Warnings:

  - You are about to drop the column `cartid` on the `ItemsTBL` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "ItemsTBL" DROP CONSTRAINT "ItemsTBL_cartid_fkey";

-- AlterTable
ALTER TABLE "ItemsTBL" DROP COLUMN "cartid";
