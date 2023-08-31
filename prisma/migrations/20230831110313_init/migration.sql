-- CreateTable
CREATE TABLE "DomainsTBL" (
    "domainid" SERIAL NOT NULL,
    "domain" TEXT NOT NULL,

    CONSTRAINT "DomainsTBL_pkey" PRIMARY KEY ("domainid")
);

-- CreateIndex
CREATE UNIQUE INDEX "DomainsTBL_domainid_key" ON "DomainsTBL"("domainid");

-- CreateIndex
CREATE UNIQUE INDEX "DomainsTBL_domain_key" ON "DomainsTBL"("domain");
