/*
  Warnings:

  - Added the required column `buildingid` to the `EmployeeTBL` table without a default value. This is not possible if the table is not empty.
  - Added the required column `departmentid` to the `EmployeeTBL` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "EmployeeTBL" ADD COLUMN     "buildingid" INTEGER NOT NULL,
ADD COLUMN     "departmentid" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "EmployeeTBL" ADD CONSTRAINT "EmployeeTBL_buildingid_fkey" FOREIGN KEY ("buildingid") REFERENCES "BuildingTBL"("buildingid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmployeeTBL" ADD CONSTRAINT "EmployeeTBL_departmentid_fkey" FOREIGN KEY ("departmentid") REFERENCES "DepartmentTBL"("departmentid") ON DELETE RESTRICT ON UPDATE CASCADE;
