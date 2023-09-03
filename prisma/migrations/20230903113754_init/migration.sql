/*
  Warnings:

  - A unique constraint covering the columns `[statusid]` on the table `OrderItemsTBL` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `statusid` to the `OrderItemsTBL` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "OrderItemsTBL" ADD COLUMN     "statusid" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "UpcomingItemsTBL" (
    "upcomingitemid" SERIAL NOT NULL,
    "empid" INTEGER NOT NULL,
    "officeboyid" INTEGER NOT NULL,

    CONSTRAINT "UpcomingItemsTBL_pkey" PRIMARY KEY ("upcomingitemid")
);

-- CreateTable
CREATE TABLE "StatusTBL" (
    "statusid" SERIAL NOT NULL,
    "status" TEXT NOT NULL,
    "upcomingItemsTBLUpcomingitemid" INTEGER,

    CONSTRAINT "StatusTBL_pkey" PRIMARY KEY ("statusid")
);

-- CreateIndex
CREATE UNIQUE INDEX "UpcomingItemsTBL_upcomingitemid_key" ON "UpcomingItemsTBL"("upcomingitemid");

-- CreateIndex
CREATE UNIQUE INDEX "UpcomingItemsTBL_officeboyid_key" ON "UpcomingItemsTBL"("officeboyid");

-- CreateIndex
CREATE UNIQUE INDEX "StatusTBL_statusid_key" ON "StatusTBL"("statusid");

-- CreateIndex
CREATE UNIQUE INDEX "StatusTBL_status_key" ON "StatusTBL"("status");

-- CreateIndex
CREATE UNIQUE INDEX "OrderItemsTBL_statusid_key" ON "OrderItemsTBL"("statusid");

-- AddForeignKey
ALTER TABLE "UpcomingItemsTBL" ADD CONSTRAINT "UpcomingItemsTBL_empid_fkey" FOREIGN KEY ("empid") REFERENCES "EmployeeTBL"("empid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UpcomingItemsTBL" ADD CONSTRAINT "UpcomingItemsTBL_officeboyid_fkey" FOREIGN KEY ("officeboyid") REFERENCES "OfficeBoyTBL"("officeboyid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItemsTBL" ADD CONSTRAINT "OrderItemsTBL_statusid_fkey" FOREIGN KEY ("statusid") REFERENCES "StatusTBL"("statusid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StatusTBL" ADD CONSTRAINT "StatusTBL_upcomingItemsTBLUpcomingitemid_fkey" FOREIGN KEY ("upcomingItemsTBLUpcomingitemid") REFERENCES "UpcomingItemsTBL"("upcomingitemid") ON DELETE SET NULL ON UPDATE CASCADE;
