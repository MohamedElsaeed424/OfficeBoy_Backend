/*
  Warnings:

  - The primary key for the `CartItemsTBL` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[cartitemid]` on the table `CartItemsTBL` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "CartItemsTBL_cartid_key";

-- AlterTable
ALTER TABLE "CartItemsTBL" DROP CONSTRAINT "CartItemsTBL_pkey",
ADD COLUMN     "cartitemid" SERIAL NOT NULL,
ALTER COLUMN "cartid" DROP DEFAULT,
ADD CONSTRAINT "CartItemsTBL_pkey" PRIMARY KEY ("cartitemid");
DROP SEQUENCE "CartItemsTBL_cartid_seq";

-- CreateIndex
CREATE UNIQUE INDEX "CartItemsTBL_cartitemid_key" ON "CartItemsTBL"("cartitemid");

-- AddForeignKey
ALTER TABLE "CartItemsTBL" ADD CONSTRAINT "CartItemsTBL_cartid_fkey" FOREIGN KEY ("cartid") REFERENCES "CartTBL"("cartid") ON DELETE RESTRICT ON UPDATE CASCADE;
