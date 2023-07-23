/*
  Warnings:

  - Added the required column `restToken` to the `UsersTBL` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "UsersTBL" ADD COLUMN     "restToken" TEXT NOT NULL;
