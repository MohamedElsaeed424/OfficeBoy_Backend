/*
  Warnings:

  - You are about to drop the column `roleid` on the `UsersTBL` table. All the data in the column will be lost.
  - You are about to drop the `RoleTBL` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `rolename` to the `UsersTBL` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "UsersTBL" DROP CONSTRAINT "UsersTBL_roleid_fkey";

-- AlterTable
ALTER TABLE "UsersTBL" DROP COLUMN "roleid",
ADD COLUMN     "rolename" TEXT NOT NULL;

-- DropTable
DROP TABLE "RoleTBL";

-- DropEnum
DROP TYPE "RoleEnumType";
