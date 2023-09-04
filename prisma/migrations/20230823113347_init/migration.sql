/*
  Warnings:

  - Added the required column `itemidescription` to the `ItemsTBL` table without a default value. This is not possible if the table is not empty.
  - Added the required column `itemsize` to the `ItemsTBL` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ItemsTBL" ADD COLUMN     "itemidescription" TEXT NOT NULL,
ADD COLUMN     "itemsize" TEXT NOT NULL;
