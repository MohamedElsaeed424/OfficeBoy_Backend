/*
  Warnings:

  - You are about to drop the column `rolename` on the `UsersTBL` table. All the data in the column will be lost.
  - Added the required column `role` to the `UsersTBL` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "UsersTBL" DROP COLUMN "rolename",
ADD COLUMN     "role" TEXT NOT NULL;
