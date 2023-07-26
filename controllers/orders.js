const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

exports.createOrder = async (req, res, next) => {
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

exports.getOrders = async (req, res, next) => {
  const orders = await prisma.ordersTBL.findMany({
    include: {
      items: true,
      romid: true,
      offid: true,
    },
  });
  res.json(orders);
};

exports.getOrder = async (req, res, next) => {
  const orderId = req.params.orderId;
  try {
    const post = await Post.findById(postId);
    if (!post) {
      const error = new Error("Sorry,This Post Not Found");
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json({ post: post });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
