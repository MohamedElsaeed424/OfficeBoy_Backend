/*
  Warnings:

  - The primary key for the `UsersTBL` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `User_id` on the `UsersTBL` table. All the data in the column will be lost.
  - You are about to drop the column `firstName` on the `UsersTBL` table. All the data in the column will be lost.
  - You are about to drop the column `lastName` on the `UsersTBL` table. All the data in the column will be lost.
  - Added the required column `firstname` to the `UsersTBL` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastname` to the `UsersTBL` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "UsersTBL" DROP CONSTRAINT "UsersTBL_pkey",
DROP COLUMN "User_id",
DROP COLUMN "firstName",
DROP COLUMN "lastName",
ADD COLUMN     "firstname" TEXT NOT NULL,
ADD COLUMN     "lastname" TEXT NOT NULL,
ADD COLUMN     "userid" SERIAL NOT NULL,
ADD CONSTRAINT "UsersTBL_pkey" PRIMARY KEY ("userid");
