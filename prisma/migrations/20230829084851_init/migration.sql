/*
  Warnings:

  - Added the required column `sizeid` to the `CartItemsTBL` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CartItemsTBL" ADD COLUMN     "sizeid" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "SizeTBL" (
    "sizeid" SERIAL NOT NULL,
    "sizename" TEXT NOT NULL,

    CONSTRAINT "SizeTBL_pkey" PRIMARY KEY ("sizeid")
);

-- CreateIndex
CREATE UNIQUE INDEX "SizeTBL_sizeid_key" ON "SizeTBL"("sizeid");

-- CreateIndex
CREATE UNIQUE INDEX "SizeTBL_sizename_key" ON "SizeTBL"("sizename");

-- AddForeignKey
ALTER TABLE "CartItemsTBL" ADD CONSTRAINT "CartItemsTBL_sizeid_fkey" FOREIGN KEY ("sizeid") REFERENCES "SizeTBL"("sizeid") ON DELETE RESTRICT ON UPDATE CASCADE;
