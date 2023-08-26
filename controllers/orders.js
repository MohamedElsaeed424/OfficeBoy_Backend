const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

exports.createOrder = async (req, res, next) => {
  //---------------------------------Validations-----------------
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Please Enter Valid Name");
    error.statusCode = 422;
    throw error;
  }
  try {
    const user = await prisma.EmployeeTBL.findUnique({
      where: {
        empid: req.userId,
      },
    });
    if (!user) {
      const error = new Error(
        "Not authorized to add items to cart , Should login first"
      );
      error.statusCode = 404;
      throw error;
    }
    let userCart = await prisma.CartTBL.findFirst({
      where: {
        employeeid: {
          empid: user.empid,
        },
      },
    });
    let cartItems = await prisma.CartItemsTBL.findMany({
      where: {
        carttid: {
          cartid: userCart.cartid,
        },
      },
    });

    // at end delete cart
    let userDeletedCart = await prisma.CartTBL.delete({
      where: {
        employeeid: {
          empid: user.empid,
        },
      },
    });

    res.status(200).json({ message: "Order Placed successfuly" });

    // // delete when u finish
    // const items = req.body.items;
    // const officeid = req.body.officeid;
    // const roomid = req.body.roomid;
    // const order = await prisma.ordersTBL.create({
    //   data: {
    //     itemname: {
    //       create: itemname,
    //     },
    //     offid: {
    //       connect: {
    //         officeid,
    //       },
    //     },
    //     romid: {
    //       connect: {
    //         roomid,
    //       },
    //     },
    //   },
    //   include: {
    //     itemname: true,
    //     romid: true,
    //     offid: true,
    //   },
    // });
    // res.json(order);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

//------------------------Search for orders------
exports.getOrders = async (req, res, next) => {
  try {
    const orders = await prisma.ordersTBL.findMany({
      include: {
        items: true,
        romid: true,
        offid: true,
      },
    });
    res.status(200).json({
      message: "Fetched All Posts Successfully",
      orders: orders,
      totalItems: totalItems,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
//------------------------Search for order------
exports.getOrder = async (req, res, next) => {
  const CartId = req.params.CartId;
  try {
    const order = await prisma.CartItemsTBL.findUnique({
      //CartItemsTBL
      where: {
        cartid: CartId, //orderid: OrderId
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
