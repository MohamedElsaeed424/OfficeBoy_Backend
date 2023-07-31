-- CreateTable
CREATE TABLE "TokensTBL" (
    "tokenid" SERIAL NOT NULL,
    "refreshtoken" TEXT NOT NULL,
    "userid" INTEGER NOT NULL,

    CONSTRAINT "TokensTBL_pkey" PRIMARY KEY ("tokenid")
);

-- AddForeignKey
ALTER TABLE "TokensTBL" ADD CONSTRAINT "TokensTBL_userid_fkey" FOREIGN KEY ("userid") REFERENCES "UsersTBL"("userid") ON DELETE RESTRICT ON UPDATE CASCADE;
