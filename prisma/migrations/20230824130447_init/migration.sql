/*
  Warnings:

  - You are about to drop the column `officeid` on the `BuildingTBL` table. All the data in the column will be lost.
  - You are about to drop the column `cartid` on the `OfficeBoyTBL` table. All the data in the column will be lost.
  - Added the required column `cartitemid` to the `OfficeBoyTBL` table without a default value. This is not possible if the table is not empty.
  - Added the required column `buildingid` to the `OfficeTBL` table without a default value. This is not possible if the table is not empty.
  - Added the required column `departmentid` to the `RoomTBL` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "BuildingTBL" DROP CONSTRAINT "BuildingTBL_officeid_fkey";

-- DropForeignKey
ALTER TABLE "OfficeBoyTBL" DROP CONSTRAINT "OfficeBoyTBL_cartid_fkey";

-- AlterTable
ALTER TABLE "BuildingTBL" DROP COLUMN "officeid";

-- AlterTable
ALTER TABLE "OfficeBoyTBL" DROP COLUMN "cartid",
ADD COLUMN     "cartitemid" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "OfficeTBL" ADD COLUMN     "buildingid" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "RoomTBL" ADD COLUMN     "departmentid" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "OfficeBoyTBL" ADD CONSTRAINT "OfficeBoyTBL_cartitemid_fkey" FOREIGN KEY ("cartitemid") REFERENCES "CartItemsTBL"("cartitemid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OfficeTBL" ADD CONSTRAINT "OfficeTBL_buildingid_fkey" FOREIGN KEY ("buildingid") REFERENCES "BuildingTBL"("buildingid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoomTBL" ADD CONSTRAINT "RoomTBL_departmentid_fkey" FOREIGN KEY ("departmentid") REFERENCES "DepartmentTBL"("departmentid") ON DELETE RESTRICT ON UPDATE CASCADE;
