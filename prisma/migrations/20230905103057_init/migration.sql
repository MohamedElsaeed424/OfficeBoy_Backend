-- CreateTable
CREATE TABLE "FinishingTBL" (
    "finishingid" SERIAL NOT NULL,
    "officeboyid" INTEGER NOT NULL,

    CONSTRAINT "FinishingTBL_pkey" PRIMARY KEY ("finishingid")
);

-- CreateTable
CREATE TABLE "FinishingItemsTBL" (
    "finishingitemid" SERIAL NOT NULL,
    "empname" TEXT NOT NULL,
    "empoffice" INTEGER NOT NULL,
    "emproomnum" INTEGER NOT NULL,
    "emproomname" TEXT NOT NULL,
    "finishingid" INTEGER NOT NULL,

    CONSTRAINT "FinishingItemsTBL_pkey" PRIMARY KEY ("finishingitemid")
);

-- CreateTable
CREATE TABLE "FinishingItemsDataTBL" (
    "finisheditemdataid" SERIAL NOT NULL,
    "itemname" TEXT NOT NULL,
    "itemquantity" INTEGER NOT NULL,
    "itemsize" TEXT NOT NULL,
    "finishingitemid" INTEGER NOT NULL,

    CONSTRAINT "FinishingItemsDataTBL_pkey" PRIMARY KEY ("finisheditemdataid")
);

-- CreateTable
CREATE TABLE "NotificationsTBL" (
    "notificationid" SERIAL NOT NULL,
    "notificationtitle" TEXT NOT NULL,
    "notificationiconURL" TEXT NOT NULL,
    "notificationdescription" TEXT NOT NULL,
    "notificationdate" TIMESTAMP(3) NOT NULL,
    "notificationtime" TIMESTAMP(3) NOT NULL,
    "userid" INTEGER NOT NULL,

    CONSTRAINT "NotificationsTBL_pkey" PRIMARY KEY ("notificationid")
);

-- CreateIndex
CREATE UNIQUE INDEX "FinishingTBL_finishingid_key" ON "FinishingTBL"("finishingid");

-- CreateIndex
CREATE UNIQUE INDEX "FinishingTBL_officeboyid_key" ON "FinishingTBL"("officeboyid");

-- CreateIndex
CREATE UNIQUE INDEX "FinishingItemsTBL_finishingitemid_key" ON "FinishingItemsTBL"("finishingitemid");

-- CreateIndex
CREATE UNIQUE INDEX "FinishingItemsDataTBL_finisheditemdataid_key" ON "FinishingItemsDataTBL"("finisheditemdataid");

-- CreateIndex
CREATE UNIQUE INDEX "NotificationsTBL_notificationid_key" ON "NotificationsTBL"("notificationid");

-- AddForeignKey
ALTER TABLE "FinishingTBL" ADD CONSTRAINT "FinishingTBL_officeboyid_fkey" FOREIGN KEY ("officeboyid") REFERENCES "OfficeBoyTBL"("officeboyid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FinishingItemsTBL" ADD CONSTRAINT "FinishingItemsTBL_finishingid_fkey" FOREIGN KEY ("finishingid") REFERENCES "FinishingTBL"("finishingid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FinishingItemsDataTBL" ADD CONSTRAINT "FinishingItemsDataTBL_finishingitemid_fkey" FOREIGN KEY ("finishingitemid") REFERENCES "FinishingItemsTBL"("finishingitemid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NotificationsTBL" ADD CONSTRAINT "NotificationsTBL_userid_fkey" FOREIGN KEY ("userid") REFERENCES "UsersTBL"("userid") ON DELETE RESTRICT ON UPDATE CASCADE;
