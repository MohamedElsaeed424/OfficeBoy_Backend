/*
  Warnings:

  - You are about to drop the column `location` on the `OfficeTBL` table. All the data in the column will be lost.
  - Added the required column `siteid` to the `EmployeeTBL` table without a default value. This is not possible if the table is not empty.
  - Added the required column `officeid` to the `RoomTBL` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "EmployeeTBL" ADD COLUMN     "siteid" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "OfficeTBL" DROP COLUMN "location";

-- AlterTable
ALTER TABLE "RoomTBL" ADD COLUMN     "officeid" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "OfficeBoyTBL" (
    "officeboyid" SERIAL NOT NULL,
    "officeid" INTEGER NOT NULL,
    "siteid" INTEGER NOT NULL,
    "cartid" INTEGER NOT NULL,

    CONSTRAINT "OfficeBoyTBL_pkey" PRIMARY KEY ("officeboyid")
);

-- CreateTable
CREATE TABLE "SiteTBL" (
    "siteid" SERIAL NOT NULL,
    "sitename" TEXT NOT NULL,

    CONSTRAINT "SiteTBL_pkey" PRIMARY KEY ("siteid")
);

-- CreateTable
CREATE TABLE "DepartmentTBL" (
    "departmentid" SERIAL NOT NULL,
    "departmentname" TEXT NOT NULL,
    "buildingid" INTEGER NOT NULL,

    CONSTRAINT "DepartmentTBL_pkey" PRIMARY KEY ("departmentid")
);

-- CreateTable
CREATE TABLE "BuildingTBL" (
    "buildingid" SERIAL NOT NULL,
    "buildingname" TEXT NOT NULL,
    "siteid" INTEGER NOT NULL,
    "officeid" INTEGER NOT NULL,

    CONSTRAINT "BuildingTBL_pkey" PRIMARY KEY ("buildingid")
);

-- CreateIndex
CREATE UNIQUE INDEX "OfficeBoyTBL_officeboyid_key" ON "OfficeBoyTBL"("officeboyid");

-- CreateIndex
CREATE UNIQUE INDEX "SiteTBL_siteid_key" ON "SiteTBL"("siteid");

-- CreateIndex
CREATE UNIQUE INDEX "DepartmentTBL_departmentid_key" ON "DepartmentTBL"("departmentid");

-- CreateIndex
CREATE UNIQUE INDEX "BuildingTBL_buildingid_key" ON "BuildingTBL"("buildingid");

-- AddForeignKey
ALTER TABLE "EmployeeTBL" ADD CONSTRAINT "EmployeeTBL_siteid_fkey" FOREIGN KEY ("siteid") REFERENCES "SiteTBL"("siteid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OfficeBoyTBL" ADD CONSTRAINT "OfficeBoyTBL_officeboyid_fkey" FOREIGN KEY ("officeboyid") REFERENCES "UsersTBL"("userid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OfficeBoyTBL" ADD CONSTRAINT "OfficeBoyTBL_officeid_fkey" FOREIGN KEY ("officeid") REFERENCES "OfficeTBL"("officeid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OfficeBoyTBL" ADD CONSTRAINT "OfficeBoyTBL_siteid_fkey" FOREIGN KEY ("siteid") REFERENCES "SiteTBL"("siteid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OfficeBoyTBL" ADD CONSTRAINT "OfficeBoyTBL_cartid_fkey" FOREIGN KEY ("cartid") REFERENCES "CartTBL"("cartid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DepartmentTBL" ADD CONSTRAINT "DepartmentTBL_buildingid_fkey" FOREIGN KEY ("buildingid") REFERENCES "BuildingTBL"("buildingid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BuildingTBL" ADD CONSTRAINT "BuildingTBL_siteid_fkey" FOREIGN KEY ("siteid") REFERENCES "SiteTBL"("siteid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BuildingTBL" ADD CONSTRAINT "BuildingTBL_officeid_fkey" FOREIGN KEY ("officeid") REFERENCES "OfficeTBL"("officeid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoomTBL" ADD CONSTRAINT "RoomTBL_officeid_fkey" FOREIGN KEY ("officeid") REFERENCES "OfficeTBL"("officeid") ON DELETE RESTRICT ON UPDATE CASCADE;
