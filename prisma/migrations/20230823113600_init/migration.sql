/*
  Warnings:

  - A unique constraint covering the columns `[itemidescription]` on the table `ItemsTBL` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[itemsize]` on the table `ItemsTBL` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "ItemsTBL_itemidescription_key" ON "ItemsTBL"("itemidescription");

-- CreateIndex
CREATE UNIQUE INDEX "ItemsTBL_itemsize_key" ON "ItemsTBL"("itemsize");
