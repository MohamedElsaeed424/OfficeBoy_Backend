/*
  Warnings:

  - Added the required column `itemimagurl` to the `ItemsTBL` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userid` to the `ItemsTBL` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ItemsTBL" ADD COLUMN     "itemimagurl" TEXT NOT NULL,
ADD COLUMN     "userid" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "ItemsTBL" ADD CONSTRAINT "ItemsTBL_userid_fkey" FOREIGN KEY ("userid") REFERENCES "UsersTBL"("userid") ON DELETE RESTRICT ON UPDATE CASCADE;
