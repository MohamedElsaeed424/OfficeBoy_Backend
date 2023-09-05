const { PrismaClient } = require("@prisma/client");
const { use } = require("passport");
const { validationResult } = require("express-validator");
const notificationSender = require("../../util/sendingNotification");
const {
  PrismaClientValidationError,
} = require("@prisma/client/runtime/library");

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
    const officeBoyId = req.body.officeBoyId;
    const receivedToken = req.body.FCMToken;
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
    const availableOfficeBoys = await prisma.OfficeBoyTBL.findMany({
      where: {
        siteref: {
          siteid: user.siteid,
        },
      },
    });
    console.log(availableOfficeBoys, "Available Office Boys ");
    const requestedOfficeBoy = await prisma.officeBoyTBL.findUnique({
      where: {
        officeboyid: officeBoyId,
      },
    });
    console.log(requestedOfficeBoy, "Office Boy Selected");
    const isReqOfficeBoyExist = availableOfficeBoys.find((officeBoy) => {
      return officeBoy.officeboyid === requestedOfficeBoy.officeboyid;
    });
    console.log(isReqOfficeBoyExist);
    if (!isReqOfficeBoyExist) {
      res.status(403).json({
        message:
          "Sorry, You can not select this office boy , he OR she maybe not in your site",
      });
      const error = new Error(
        "Sorry, You can not select this office boy ,he OR she maybe not in your site"
      );
      error.statusCode = 403;
      throw error;
    }
    let userCart = await prisma.CartTBL.findFirst({
      where: {
        employeeid: {
          empid: user.empid,
        },
      },
    });
    if (!userCart) {
      res.status(404).json({
        message: " Add item to the cart First",
      });
      const error = new Error("Add item to the cart First");
      error.statusCode = 404;
      throw error;
    }
    let cartItems = await prisma.CartItemsTBL.findMany({
      where: {
        carttid: {
          cartid: userCart.cartid,
        },
      },
      include: {
        itemids: true,
        sizeref: true,
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
    const orderItem = await prisma.OrderItemsTBL.create({
      data: {
        ordersid: {
          connect: {
            orderid: order.orderid,
          },
        },
      },
    });
    for (let i = 0; i < cartItems.length; i++) {
      console.log("orderCartItemi: ", cartItems[i]);
      const orderItemData = await prisma.OrderItemsDataTBL.create({
        data: {
          itemname: cartItems[i].itemids.itemname,
          itemquantity: cartItems[i].quanity,
          sizeref: {
            connect: {
              sizeid: cartItems[i].sizeref.sizeid,
            },
          },
          orderItemsref: {
            connect: {
              orderitemid: orderItem.orderitemid,
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
      orderItemsContainer.push(orderItemData);
    }
    //send items to requested office boy--------------------------------------
    const actualEmployee = await prisma.EmployeeTBL.findUnique({
      where: {
        empid: user.empid,
      },
      include: {
        emp: true,
        romid: true,
        offid: true,
      },
    });
    const createdUpcoming = await prisma.UpcomingTBL.findUnique({
      where: {
        officeboyid: requestedOfficeBoy.officeboyid,
      },
    });
    const createdUpcomingItem = await prisma.UpcomingItemsTBL.create({
      data: {
        empname:
          "Eng. " +
          actualEmployee.emp.firstname +
          " " +
          actualEmployee.emp.lastname,
        empoffice: actualEmployee.offid.officeno,
        emproomnum: actualEmployee.romid.roomno,
        emproomname: actualEmployee.romid.roomname,
        orderitemref: {
          connect: {
            orderitemid: orderItem.orderitemid,
          },
        },
        upcomingref: {
          connect: {
            upcomingid: createdUpcoming.upcomingid,
          },
        },
      },
    });
    for (let i = 0; i < orderItemsContainer.length; i++) {
      const orderItemForSize = await prisma.OrderItemsDataTBL.findUnique({
        where: {
          orderitemsdataid: orderItemsContainer[i].orderitemsdataid,
        },
        include: {
          sizeref: true,
        },
      });
      const upcomingItem = await prisma.UpcomingItemsDataTBL.create({
        data: {
          itemname: orderItemsContainer[i].itemname,
          itemquantity: orderItemsContainer[i].itemquantity,
          itemsize: orderItemForSize.sizeref.sizename,
          UpcomingItemsref: {
            connect: {
              upcomingitemid: createdUpcomingItem.upcomingitemid,
            },
          },
        },
      });
    }
    // at end delete cart
    let userDeletedCart = await prisma.CartTBL.delete({
      where: {
        cartid: userCart.cartid,
      },
    });
    // notificationSender(
    //   receivedToken,
    //   "Order Created",
    //   "${createdUpcomingItem.empname} Ordered Something"
    // );
    res.status(202).json({
      message: "Order created successfully",
      orderNom: order.orderid,
      order: orderItem,
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
      res.status(404).json({
        message: "Not authorized to create Order , Should login first",
      });
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

    if (ordersData.length === 0) {
      res.status(404).json({ message: "Sorry,No orders yet" });
      const error = new Error("Sorry,No orders yet");
      error.statusCode = 404;
      throw error;
    }
    let ordersItemsContainer = [];
    console.log(ordersData.length);
    for (let j = 0; j < ordersData.length; j++) {
      for (let i = 0; i < ordersData[j].orderItems.length; i++) {
        const orderItem = await prisma.OrderItemsTBL.findUnique({
          where: {
            orderitemid: ordersData[j].orderItems[i].orderitemid,
          },
          include: {
            OrderItemsData: true,
          },
        });
        ordersItemsContainer.push(orderItem);
      }
    }
    res
      .status(200)
      .json({ Orders: ordersData, OrderItemData: ordersItemsContainer });
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
      res.status(404).json({
        message: "Not authorized to create Order , Should login first",
      });
      const error = new Error(
        "Not authorized to add items to cart , Should login first"
      );
      error.statusCode = 404;
      throw error;
    }
    const AllEmpOrders = await prisma.ordersTBL.findMany({
      where: {
        empref: {
          empid: user.empid,
        },
      },
    });
    const order = AllEmpOrders[AllEmpOrders.length - 1];
    if (!order) {
      res.status(404).json({ message: "No Orders yet , Try Place an order" });
      const error = new Error("No Orders yet , Try Place an order");
      error.statusCode = 404;
      throw error;
    } else {
      const orderItems = await prisma.OrderItemsTBL.findMany({
        where: {
          ordersid: {
            orderid: parseInt(order.orderid),
          },
        },
        include: {
          OrderItemsData: true,
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
    const officeBoyId = req.body.officeBoyId;
    const receivedToken = req.body.FCMToken;
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
    const availableOfficeBoys = await prisma.OfficeBoyTBL.findMany({
      where: {
        siteref: {
          siteid: user.siteid,
        },
      },
    });
    console.log(availableOfficeBoys, "Available Office Boys ");
    const requestedOfficeBoy = await prisma.officeBoyTBL.findUnique({
      where: {
        officeboyid: officeBoyId,
      },
    });
    console.log(requestedOfficeBoy, "Office Boy Selected");
    const isReqOfficeBoyExist = availableOfficeBoys.find((officeBoy) => {
      return officeBoy.officeboyid === requestedOfficeBoy.officeboyid;
    });
    console.log(isReqOfficeBoyExist);
    if (!isReqOfficeBoyExist) {
      res.status(403).json({
        message:
          "Sorry, You can not select this office boy , he OR she maybe not in your site",
      });
      const error = new Error(
        "Sorry, You can not select this office boy ,he OR she maybe not in your site"
      );
      error.statusCode = 403;
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
    // console.log("idssss", searchedOrder.orderItems[0].orderitemid);
    const searchedOrderItemsData = await prisma.OrderItemsDataTBL.findMany({
      where: {
        orderitemid: searchedOrder.orderItems[0].orderitemid,
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
      const orderItem = await prisma.OrderItemsTBL.create({
        data: {
          ordersid: {
            connect: {
              orderid: order.orderid,
            },
          },
        },
      });
      // console.log(searchedOrderItemsData.length);

      for (let i = 0; i < searchedOrderItemsData.length; i++) {
        // console.log("orderCartItemi: ", searchedOrderItemsData[i]);
        const orderItemData = await prisma.OrderItemsDataTBL.create({
          data: {
            itemname: searchedOrderItemsData[i].itemname,
            itemquantity: searchedOrderItemsData[i].itemquantity,
            sizeref: {
              connect: {
                sizeid: searchedOrderItemsData[i].sizeid,
              },
            },
            orderItemsref: {
              connect: {
                orderitemid: orderItem.orderitemid,
              },
            },
          },
        });
        orderItemsContainer.push(orderItemData);
      }

      //send items to requested office boy--------------------------------------
      const actualEmployee = await prisma.EmployeeTBL.findUnique({
        where: {
          empid: user.empid,
        },
        include: {
          emp: true,
          romid: true,
          offid: true,
        },
      });
      const createdUpcoming = await prisma.UpcomingTBL.findUnique({
        where: {
          officeboyid: requestedOfficeBoy.officeboyid,
        },
      });
      const createdUpcomingItem = await prisma.UpcomingItemsTBL.create({
        data: {
          empname:
            "Eng. " +
            actualEmployee.emp.firstname +
            " " +
            actualEmployee.emp.lastname,
          empoffice: actualEmployee.offid.officeno,
          emproomnum: actualEmployee.romid.roomno,
          emproomname: actualEmployee.romid.roomname,
          orderitemref: {
            connect: {
              orderitemid: orderItem.orderitemid,
            },
          },
          upcomingref: {
            connect: {
              upcomingid: createdUpcoming.upcomingid,
            },
          },
        },
      });
      for (let i = 0; i < orderItemsContainer.length; i++) {
        const orderItemForSize = await prisma.OrderItemsDataTBL.findUnique({
          where: {
            orderitemsdataid: orderItemsContainer[i].orderitemsdataid,
          },
          include: {
            sizeref: true,
          },
        });
        const upcomingItem = await prisma.UpcomingItemsDataTBL.create({
          data: {
            itemname: orderItemsContainer[i].itemname,
            itemquantity: orderItemsContainer[i].itemquantity,
            itemsize: orderItemForSize.sizeref.sizename,
            UpcomingItemsref: {
              connect: {
                upcomingitemid: createdUpcomingItem.upcomingitemid,
              },
            },
          },
        });
      }
      // notificationSender(
      //   receivedToken,
      //   "Order Created",
      //   "${createdUpcomingItem.empname} Ordered Something"
      // );
      res.status(202).json({
        message: "Reorder created successfully",
        orderNom: order.orderid,
        order: orderItem,
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
