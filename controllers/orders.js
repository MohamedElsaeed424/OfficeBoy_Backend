const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

exports.createOrder = async (req, res, next) => {
  const itemname = req.body.itemname;
  const officeid = req.body.officeid;
  const roomid = req.body.roomid;
  const order = await prisma.ordersTBL.create({
    data: {
      itemname: {
        create: itemname,
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
      itemname: true,
      romid: true,
      offid: true,
    },
  });
  res.json(order);
};

exports.getOrders = async (req, res, next) => {
  const orders = await prisma.ordersTBL.findMany({
    include: {
      itemname: true,
      romid: true,
      offid: true,
    },
  });
  res.json(orders);
};

exports.getOrder = async (req, res, next) => {
  const orderId = req.params.orderId;
  try {
    const order = await prisma.OrderItemsTBL.findUnique({
      where: {
        orderid: orderId,
      },
    });
    if (!order) {
      const error = new Error("Sorry,This Order Not Found");
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json({ order: order });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
