/*
  Warnings:

  - You are about to drop the column `token` on the `UsersTBL` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "UsersTBL" DROP COLUMN "token",
ADD COLUMN     "fcmtoken" TEXT;
