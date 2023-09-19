/*
  Warnings:

  - You are about to drop the column `refreshtoken` on the `TokensTBL` table. All the data in the column will be lost.
  - You are about to drop the `BlacklistedToken` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `blackListedToken` to the `TokensTBL` table without a default value. This is not possible if the table is not empty.
  - Added the required column `createddate` to the `TokensTBL` table without a default value. This is not possible if the table is not empty.
  - Added the required column `createdtime` to the `TokensTBL` table without a default value. This is not possible if the table is not empty.
  - Added the required column `expiresIn` to the `TokensTBL` table without a default value. This is not possible if the table is not empty.
  - Added the required column `token` to the `TokensTBL` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `TokensTBL` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TokensTBL" DROP COLUMN "refreshtoken",
ADD COLUMN     "blackListedToken" BOOLEAN NOT NULL,
ADD COLUMN     "createddate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "createdtime" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "expiresIn" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "token" TEXT NOT NULL,
ADD COLUMN     "type" TEXT NOT NULL;

-- DropTable
DROP TABLE "BlacklistedToken";
