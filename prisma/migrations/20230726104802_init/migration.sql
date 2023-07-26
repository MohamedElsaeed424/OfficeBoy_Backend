-- CreateTable
CREATE TABLE "OrdersTBL" (
    "itemid" INTEGER NOT NULL,
    "orderid" SERIAL NOT NULL,
    "officeid" INTEGER NOT NULL,
    "roomid" INTEGER NOT NULL,

    CONSTRAINT "OrdersTBL_pkey" PRIMARY KEY ("orderid")
);

-- CreateIndex
CREATE UNIQUE INDEX "OrdersTBL_orderid_key" ON "OrdersTBL"("orderid");

-- AddForeignKey
ALTER TABLE "OrdersTBL" ADD CONSTRAINT "OrdersTBL_itemid_fkey" FOREIGN KEY ("itemid") REFERENCES "ItemsTBL"("itemid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrdersTBL" ADD CONSTRAINT "OrdersTBL_officeid_fkey" FOREIGN KEY ("officeid") REFERENCES "OfficeTBL"("officeid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrdersTBL" ADD CONSTRAINT "OrdersTBL_roomid_fkey" FOREIGN KEY ("roomid") REFERENCES "RoomTBL"("roomid") ON DELETE RESTRICT ON UPDATE CASCADE;
