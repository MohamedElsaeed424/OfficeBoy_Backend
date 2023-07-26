-- CreateTable
CREATE TABLE "OrderItemsTBL" (
    "orderitemid" SERIAL NOT NULL,
    "orderid" INTEGER NOT NULL,

    CONSTRAINT "OrderItemsTBL_pkey" PRIMARY KEY ("orderitemid")
);

-- CreateIndex
CREATE UNIQUE INDEX "OrderItemsTBL_orderitemid_key" ON "OrderItemsTBL"("orderitemid");

-- AddForeignKey
ALTER TABLE "OrderItemsTBL" ADD CONSTRAINT "OrderItemsTBL_orderid_fkey" FOREIGN KEY ("orderid") REFERENCES "OrdersTBL"("orderid") ON DELETE RESTRICT ON UPDATE CASCADE;
