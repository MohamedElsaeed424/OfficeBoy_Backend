/*
  Warnings:

  - Added the required column `empname` to the `UpcomingItemsTBL` table without a default value. This is not possible if the table is not empty.
  - Added the required column `empoffice` to the `UpcomingItemsTBL` table without a default value. This is not possible if the table is not empty.
  - Added the required column `emproomname` to the `UpcomingItemsTBL` table without a default value. This is not possible if the table is not empty.
  - Added the required column `emproomnum` to the `UpcomingItemsTBL` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "UpcomingItemsTBL" ADD COLUMN     "empname" TEXT NOT NULL,
ADD COLUMN     "empoffice" INTEGER NOT NULL,
ADD COLUMN     "emproomname" TEXT NOT NULL,
ADD COLUMN     "emproomnum" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "UpcomingItemsDataTBL" (
    "upcomingItemsDataid" SERIAL NOT NULL,
    "itemname" TEXT NOT NULL,
    "itemquantity" INTEGER NOT NULL,
    "itemsize" TEXT NOT NULL,
    "upcomingitemid" INTEGER NOT NULL,

    CONSTRAINT "UpcomingItemsDataTBL_pkey" PRIMARY KEY ("upcomingItemsDataid")
);

-- CreateIndex
CREATE UNIQUE INDEX "UpcomingItemsDataTBL_upcomingItemsDataid_key" ON "UpcomingItemsDataTBL"("upcomingItemsDataid");

-- AddForeignKey
ALTER TABLE "UpcomingItemsDataTBL" ADD CONSTRAINT "UpcomingItemsDataTBL_upcomingitemid_fkey" FOREIGN KEY ("upcomingitemid") REFERENCES "UpcomingItemsTBL"("upcomingitemid") ON DELETE RESTRICT ON UPDATE CASCADE;
