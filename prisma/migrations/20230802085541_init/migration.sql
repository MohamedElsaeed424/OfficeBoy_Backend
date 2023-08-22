/*
  Warnings:

  - You are about to drop the column `cartid` on the `EmployeeTBL` table. All the data in the column will be lost.
  - Added the required column `empid` to the `CartTBL` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "EmployeeTBL" DROP CONSTRAINT "EmployeeTBL_cartid_fkey";

-- AlterTable
ALTER TABLE "CartTBL" ADD COLUMN     "empid" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "EmployeeTBL" DROP COLUMN "cartid";

-- AddForeignKey
ALTER TABLE "CartTBL" ADD CONSTRAINT "CartTBL_empid_fkey" FOREIGN KEY ("empid") REFERENCES "EmployeeTBL"("empid") ON DELETE RESTRICT ON UPDATE CASCADE;
