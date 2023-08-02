/*
  Warnings:

  - You are about to drop the column `empid` on the `CartTBL` table. All the data in the column will be lost.
  - Added the required column `cartid` to the `EmployeeTBL` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "CartTBL" DROP CONSTRAINT "CartTBL_empid_fkey";

-- AlterTable
ALTER TABLE "CartTBL" DROP COLUMN "empid";

-- AlterTable
ALTER TABLE "EmployeeTBL" ADD COLUMN     "cartid" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "EmployeeTBL" ADD CONSTRAINT "EmployeeTBL_cartid_fkey" FOREIGN KEY ("cartid") REFERENCES "CartTBL"("cartid") ON DELETE RESTRICT ON UPDATE CASCADE;
