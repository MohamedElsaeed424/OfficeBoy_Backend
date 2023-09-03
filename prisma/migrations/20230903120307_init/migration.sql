/*
  Warnings:

  - You are about to drop the column `upcomingItemsTBLUpcomingitemid` on the `StatusTBL` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[statusid]` on the table `UpcomingItemsTBL` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `statusid` to the `UpcomingItemsTBL` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "StatusTBL" DROP CONSTRAINT "StatusTBL_upcomingItemsTBLUpcomingitemid_fkey";

-- AlterTable
ALTER TABLE "StatusTBL" DROP COLUMN "upcomingItemsTBLUpcomingitemid";

-- AlterTable
ALTER TABLE "UpcomingItemsTBL" ADD COLUMN     "statusid" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "UpcomingItemsTBL_statusid_key" ON "UpcomingItemsTBL"("statusid");

-- AddForeignKey
ALTER TABLE "UpcomingItemsTBL" ADD CONSTRAINT "UpcomingItemsTBL_statusid_fkey" FOREIGN KEY ("statusid") REFERENCES "StatusTBL"("statusid") ON DELETE RESTRICT ON UPDATE CASCADE;
