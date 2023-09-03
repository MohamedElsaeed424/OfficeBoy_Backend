-- AlterTable
ALTER TABLE "OrderItemsTBL" ALTER COLUMN "statusid" SET DEFAULT 3;

-- AlterTable
ALTER TABLE "UpcomingItemsTBL" ALTER COLUMN "statusid" DROP DEFAULT;
