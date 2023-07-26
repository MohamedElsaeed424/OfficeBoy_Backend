const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

exports.order = async (req, res, next) => {
  const items = req.body.items;
  const officeid = req.body.officeid;
  const roomid = req.body.roomid;
  const order = await prisma.ordersTBL.create({
    data: {
      items: {
        create: items,
      },
      offid: {
        connect: {
          officeid,
        },
      },
      romid: {
        connect: {
          roomid,
        },
      },
    },
    include: {
      items: true,
      romid: true,
      offid: true,
    },
  });
  res.json(order);
};

exports.orders = async (req, res, next) => {
  const orders = await prisma.ordersTBL.findMany({
    include: {
      items: true,
      romid: true,
      offid: true,
    },
  });
  res.json(orders);
};
