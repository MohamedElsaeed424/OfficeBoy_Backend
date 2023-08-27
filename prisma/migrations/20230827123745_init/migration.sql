/*
  Warnings:

  - You are about to drop the column `role` on the `UsersTBL` table. All the data in the column will be lost.
  - Added the required column `roleid` to the `UsersTBL` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "UsersTBL" DROP COLUMN "role",
ADD COLUMN     "roleid" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "RoleTBL" (
    "roleid" SERIAL NOT NULL,
    "rolename" TEXT NOT NULL,

    CONSTRAINT "RoleTBL_pkey" PRIMARY KEY ("roleid")
);

-- CreateIndex
CREATE UNIQUE INDEX "RoleTBL_roleid_key" ON "RoleTBL"("roleid");

-- CreateIndex
CREATE UNIQUE INDEX "RoleTBL_rolename_key" ON "RoleTBL"("rolename");

-- AddForeignKey
ALTER TABLE "UsersTBL" ADD CONSTRAINT "UsersTBL_roleid_fkey" FOREIGN KEY ("roleid") REFERENCES "RoleTBL"("roleid") ON DELETE RESTRICT ON UPDATE CASCADE;
