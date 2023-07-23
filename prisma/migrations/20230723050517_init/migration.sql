/*
  Warnings:

  - You are about to drop the column `restToken` on the `UsersTBL` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "UsersTBL" DROP COLUMN "restToken";

-- CreateTable
CREATE TABLE "BlacklistedToken" (
    "id" SERIAL NOT NULL,
    "token" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BlacklistedToken_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BlacklistedToken_token_key" ON "BlacklistedToken"("token");
