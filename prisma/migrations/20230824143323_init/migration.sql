/*
  Warnings:

  - A unique constraint covering the columns `[buildingname]` on the table `BuildingTBL` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[departmentname]` on the table `DepartmentTBL` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[roomno]` on the table `RoomTBL` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[roomname]` on the table `RoomTBL` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[sitename]` on the table `SiteTBL` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "BuildingTBL_buildingname_key" ON "BuildingTBL"("buildingname");

-- CreateIndex
CREATE UNIQUE INDEX "DepartmentTBL_departmentname_key" ON "DepartmentTBL"("departmentname");

-- CreateIndex
CREATE UNIQUE INDEX "RoomTBL_roomno_key" ON "RoomTBL"("roomno");

-- CreateIndex
CREATE UNIQUE INDEX "RoomTBL_roomname_key" ON "RoomTBL"("roomname");

-- CreateIndex
CREATE UNIQUE INDEX "SiteTBL_sitename_key" ON "SiteTBL"("sitename");
