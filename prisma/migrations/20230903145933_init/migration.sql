/*
  Warnings:

  - You are about to drop the column `itemsize` on the `OrderItemsTBL` table. All the data in the column will be lost.
  - Added the required column `sizeid` to the `OrderItemsTBL` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "OrderItemsTBL" DROP COLUMN "itemsize",
ADD COLUMN     "sizeid" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "OrderItemsTBL" ADD CONSTRAINT "OrderItemsTBL_sizeid_fkey" FOREIGN KEY ("sizeid") REFERENCES "SizeTBL"("sizeid") ON DELETE RESTRICT ON UPDATE CASCADE;
