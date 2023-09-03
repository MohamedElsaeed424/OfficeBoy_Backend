const { PrismaClient } = require("@prisma/client");
const { use } = require("passport");
const { validationResult } = require("express-validator");

const prisma = new PrismaClient();

exports.createOrder = async (req, res, next) => {
  //---------------------------------Validations-----------------

  try {
    // const errors = validationResult(req);
    // if (!errors.isEmpty()) {
    //   const error = new Error("Please Enter Valid Name");
    //   error.statusCode = 422;
    //   throw error;
    // }
    const user = await prisma.EmployeeTBL.findUnique({
      where: {
        empid: req.userId,
      },
    });
    if (!user) {
      res.status(404).json({
        message: "Not authorized to create Order , Should login first",
      });
      const error = new Error(
        "Not authorized to create Order , Should login first"
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
      include: {
        itemids: true,
      },
    });
    console.log("cartItems: ", cartItems);
    const order = await prisma.OrdersTBL.create({
      data: {
        empref: {
          connect: {
            empid: user.empid,
          },
        },
      },
    });
    let orderItemsContainer = [];
    for (let i = 0; i < cartItems.length; i++) {
      console.log("orderCartItemi: ", cartItems[i]);
      const orderItem = await prisma.OrderItemsTBL.create({
        data: {
          itemname: cartItems[i].itemids.itemname,
          itemquantity: cartItems[i].quanity,
          itemsize: cartItems[i].itemsize,
          ordersid: {
            connect: {
              orderid: order.orderid,
            },
          },
        },
      });

      // delete items from cart
      const deletedCartItems = await prisma.CartItemsTBL.delete({
        where: {
          cartitemid: cartItems[i].cartitemid,
        },
      });
      orderItemsContainer.push(orderItem);
    }
    // at end delete cart
    let userDeletedCart = await prisma.CartTBL.delete({
      where: {
        cartid: userCart.cartid,
      },
    });
    res.status(202).json({
      message: "Order created successfully",
      orderNom: order.id,
      orderItems: orderItemsContainer,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

//------------------------Search for orders------
exports.getOrdersHistory = async (req, res, next) => {
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

    const ordersData = await prisma.OrdersTBL.findMany({
      where: {
        empref: {
          empid: user.empid,
        },
      },
      include: { orderItems: true },
    });

    if (ordersData.length == 0) {
      res.status(404).json({ message: "Sorry,No orders yet" });
      const error = new Error("Sorry,No orders yet");
      error.statusCode = 404;
      throw error;
    } else {
      res.status(200).json({ Orders: ordersData });
    }
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
//------------------------Search for order------
exports.getOrder = async (req, res, next) => {
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
    const order = await prisma.ordersTBL.findFirst({
      where: {
        empref: {
          empid: user.empid,
        },
      },
    });
    if (!order) {
      res.status(404).json({ message: "Sorry,This Order Not Found" });
      const error = new Error("Sorry,This Order Not Found");
      error.statusCode = 404;
      throw error;
    } else {
      const orderItems = await prisma.OrderItemsTBL.findMany({
        where: {
          ordersid: {
            orderid: parseInt(order.orderid),
          },
        },
      });
      res.status(200).json({ orderNom: order, orderItems: orderItems });
    }
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.reOrder = async (req, res, next) => {
  try {
    const orderId = req.params.orderId;
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
    // here to get order and the order items
    const searchedOrder = await prisma.OrdersTBL.findUnique({
      where: {
        orderid: parseInt(orderId),
      },
      include: {
        orderItems: true,
      },
    });
    if (!searchedOrder) {
      res.status(404).json({
        message: "You can not reorder this order is dosn't exsist",
      });
      const error = new Error(
        "You can not reorder this order is dosn't exsist"
      );
      error.statusCode = 404;
      throw error;
    } else {
      const order = await prisma.OrdersTBL.create({
        data: {
          empref: {
            connect: {
              empid: user.empid,
            },
          },
        },
      });
      let orderItemsContainer = [];
      for (let i = 0; i < searchedOrder.orderItems.length; i++) {
        console.log("orderCartItemi: ", searchedOrder.orderItems[i]);
        const orderItem = await prisma.OrderItemsTBL.create({
          data: {
            itemname: searchedOrder.orderItems[i].itemname,
            itemquantity: searchedOrder.orderItems[i].itemquantity,
            itemsize: searchedOrder.orderItems[i].itemsize,
            ordersid: {
              connect: {
                orderid: order.orderid,
              },
            },
          },
        });
        orderItemsContainer.push(orderItem);
      }
      res.status(202).json({
        message: "Reorder created successfully",
        orderNom: order.id,
        orderItems: orderItemsContainer,
      });
    }
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
