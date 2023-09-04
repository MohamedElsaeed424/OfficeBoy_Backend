/*
  Warnings:

  - Added the required column `cartid` to the `OrderItemsTBL` table without a default value. This is not possible if the table is not empty.
  - Added the required column `quanity` to the `OrderItemsTBL` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "OrderItemsTBL" ADD COLUMN     "cartid" INTEGER NOT NULL,
ADD COLUMN     "quanity" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "CartTBL" (
    "cartid" SERIAL NOT NULL,
    "empid" INTEGER NOT NULL,

    CONSTRAINT "CartTBL_pkey" PRIMARY KEY ("cartid")
);

-- CreateIndex
CREATE UNIQUE INDEX "CartTBL_cartid_key" ON "CartTBL"("cartid");

-- AddForeignKey
ALTER TABLE "CartTBL" ADD CONSTRAINT "CartTBL_empid_fkey" FOREIGN KEY ("empid") REFERENCES "EmployeeTBL"("empid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItemsTBL" ADD CONSTRAINT "OrderItemsTBL_cartid_fkey" FOREIGN KEY ("cartid") REFERENCES "CartTBL"("cartid") ON DELETE RESTRICT ON UPDATE CASCADE;
