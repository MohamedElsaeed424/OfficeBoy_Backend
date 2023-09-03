/*
  Warnings:

  - You are about to drop the column `empid` on the `UpcomingItemsTBL` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "UpcomingItemsTBL" DROP CONSTRAINT "UpcomingItemsTBL_empid_fkey";

-- AlterTable
ALTER TABLE "UpcomingItemsTBL" DROP COLUMN "empid",
ALTER COLUMN "statusid" SET DEFAULT 3;
