/*
  Warnings:

  - You are about to drop the column `officeboyid` on the `UpcomingItemsTBL` table. All the data in the column will be lost.
  - Added the required column `upcomingid` to the `UpcomingItemsTBL` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "UpcomingItemsTBL" DROP CONSTRAINT "UpcomingItemsTBL_officeboyid_fkey";

-- DropIndex
DROP INDEX "UpcomingItemsTBL_officeboyid_key";

-- AlterTable
ALTER TABLE "OrderItemsTBL" ADD COLUMN     "upcomingitemid" INTEGER;

-- AlterTable
ALTER TABLE "UpcomingItemsTBL" DROP COLUMN "officeboyid",
ADD COLUMN     "upcomingid" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "UpcomingTBL" (
    "upcomingid" SERIAL NOT NULL,
    "officeboyid" INTEGER NOT NULL,

    CONSTRAINT "UpcomingTBL_pkey" PRIMARY KEY ("upcomingid")
);

-- CreateIndex
CREATE UNIQUE INDEX "UpcomingTBL_upcomingid_key" ON "UpcomingTBL"("upcomingid");

-- CreateIndex
CREATE UNIQUE INDEX "UpcomingTBL_officeboyid_key" ON "UpcomingTBL"("officeboyid");

-- AddForeignKey
ALTER TABLE "UpcomingTBL" ADD CONSTRAINT "UpcomingTBL_officeboyid_fkey" FOREIGN KEY ("officeboyid") REFERENCES "OfficeBoyTBL"("officeboyid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UpcomingItemsTBL" ADD CONSTRAINT "UpcomingItemsTBL_upcomingid_fkey" FOREIGN KEY ("upcomingid") REFERENCES "UpcomingTBL"("upcomingid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItemsTBL" ADD CONSTRAINT "OrderItemsTBL_upcomingitemid_fkey" FOREIGN KEY ("upcomingitemid") REFERENCES "UpcomingItemsTBL"("upcomingitemid") ON DELETE SET NULL ON UPDATE CASCADE;
