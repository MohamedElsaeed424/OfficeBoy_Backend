-- CreateEnum
CREATE TYPE "RoleEnumType" AS ENUM ('admin', 'employee', 'officeBoy');

-- CreateTable
CREATE TABLE "OfficeTBL" (
    "officeid" SERIAL NOT NULL,
    "officeno" INTEGER NOT NULL,
    "location" TEXT NOT NULL,

    CONSTRAINT "OfficeTBL_pkey" PRIMARY KEY ("officeid")
);

-- CreateTable
CREATE TABLE "RoomTBL" (
    "roomid" SERIAL NOT NULL,
    "roomno" INTEGER NOT NULL,
    "roomname" TEXT NOT NULL,

    CONSTRAINT "RoomTBL_pkey" PRIMARY KEY ("roomid")
);

-- CreateTable
CREATE TABLE "EmployeeTBL" (
    "empid" SERIAL NOT NULL,
    "roomid" INTEGER NOT NULL,
    "officeid" INTEGER NOT NULL,

    CONSTRAINT "EmployeeTBL_pkey" PRIMARY KEY ("empid")
);

-- CreateTable
CREATE TABLE "CategoriesTbl" (
    "categoryid" SERIAL NOT NULL,
    "categoryname" TEXT NOT NULL,

    CONSTRAINT "CategoriesTbl_pkey" PRIMARY KEY ("categoryid")
);

-- CreateTable
CREATE TABLE "ItemsTBL" (
    "categoryid" INTEGER NOT NULL,
    "itemid" SERIAL NOT NULL,
    "itemname" TEXT NOT NULL,

    CONSTRAINT "ItemsTBL_pkey" PRIMARY KEY ("itemid")
);

-- CreateIndex
CREATE UNIQUE INDEX "OfficeTBL_officeid_key" ON "OfficeTBL"("officeid");

-- CreateIndex
CREATE UNIQUE INDEX "OfficeTBL_officeno_key" ON "OfficeTBL"("officeno");

-- CreateIndex
CREATE UNIQUE INDEX "RoomTBL_roomid_key" ON "RoomTBL"("roomid");

-- CreateIndex
CREATE UNIQUE INDEX "EmployeeTBL_empid_key" ON "EmployeeTBL"("empid");

-- CreateIndex
CREATE UNIQUE INDEX "CategoriesTbl_categoryid_key" ON "CategoriesTbl"("categoryid");

-- CreateIndex
CREATE UNIQUE INDEX "CategoriesTbl_categoryname_key" ON "CategoriesTbl"("categoryname");

-- CreateIndex
CREATE UNIQUE INDEX "ItemsTBL_itemid_key" ON "ItemsTBL"("itemid");

-- CreateIndex
CREATE UNIQUE INDEX "ItemsTBL_itemname_key" ON "ItemsTBL"("itemname");

-- AddForeignKey
ALTER TABLE "EmployeeTBL" ADD CONSTRAINT "EmployeeTBL_empid_fkey" FOREIGN KEY ("empid") REFERENCES "UsersTBL"("userid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmployeeTBL" ADD CONSTRAINT "EmployeeTBL_roomid_fkey" FOREIGN KEY ("roomid") REFERENCES "RoomTBL"("roomid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmployeeTBL" ADD CONSTRAINT "EmployeeTBL_officeid_fkey" FOREIGN KEY ("officeid") REFERENCES "OfficeTBL"("officeid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemsTBL" ADD CONSTRAINT "ItemsTBL_categoryid_fkey" FOREIGN KEY ("categoryid") REFERENCES "CategoriesTbl"("categoryid") ON DELETE RESTRICT ON UPDATE CASCADE;
