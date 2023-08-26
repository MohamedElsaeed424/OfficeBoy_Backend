/*
  Warnings:

  - You are about to drop the column `cartitemid` on the `OfficeBoyTBL` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "OfficeBoyTBL" DROP CONSTRAINT "OfficeBoyTBL_cartitemid_fkey";

-- AlterTable
ALTER TABLE "OfficeBoyTBL" DROP COLUMN "cartitemid";
