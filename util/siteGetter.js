const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const getSite = async (siteId) => {
  const site = await prisma.SiteTBL.findUnique({
    where: {
      siteid: siteId,
    },
    include: {
      Building: true,
    },
  });
  return site;
};

exports.getSite = getSite;
