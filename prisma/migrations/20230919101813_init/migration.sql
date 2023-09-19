/*
  Warnings:

  - A unique constraint covering the columns `[token]` on the table `TokensTBL` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "TokensTBL_token_key" ON "TokensTBL"("token");
