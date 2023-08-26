// rokia

const express = require("express");
const { PrismaClient } = require("@prisma/client");
const { use } = require("passport");

const prisma = new PrismaClient();
const app = express();

app.use(express.json());

//find unique user
exports.addItem = async (req, res, next) => {
  const user = await prisma.UsersTBL.findUnique({
    where: {
      userid: req.userId,
    },
  });
  console.log(user);
  console.log(user.userid);
};

// GET cart with its items
exports.getCartItems = async (req, res, next) => {
  const cartId = parseInt(req.params.cartId);
  try {
    //find unique cart record that matches provided cart id < related order item associated with that cart
    const cart = await prisma.CartTBL.findUnique({
      where: { cartid: cartId },
      include: { CartItems: true },
    });
    if (!cart) {
      res.status(404).json({ message: "Sorry, No Items in cart to be shown" });
      const error = new Error("Sorry, No Items in cart to be shown");
      error.statusCode = 404;
      throw error;
    }
    res.json({ message: "cart fetched successfully", cart: cart });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

// // POST new cart with items
exports.addItemsToCart = async (req, res, next) => {
  const itemId = req.body.itemId;
  const size = req.body.itemSize;
  const officeBoyId = req.body.officeBoyId;

  try {
    //Find the user by userid
    const user = await prisma.EmployeeTBL.findUnique({
      where: {
        empid: req.userId,
      },
    });
    if (!user) {
      const error = new Error("Not authorized to add items to cart");
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
    var isReqOfficeBoyExist = availableOfficeBoys.includes(requestedOfficeBoy);
    console.log(isReqOfficeBoyExist);
    if (isReqOfficeBoyExist) {
      res
        .status(403)
        .json({ message: "Sorry, You can not select this office boy " });
      const error = new Error("Sorry, You can not select this office boy");
      error.statusCode = 403;
      throw error;
    }
    // Find the user's cart or create a new cart if it doesn't exist
    let userCart = await prisma.CartTBL.findFirst({
      where: {
        employeeid: {
          empid: user.empid,
        },
      },
    });

    if (!userCart) {
      userCart = await prisma.CartTBL.create({
        data: {
          employeeid: {
            connect: {
              empid: user.empid,
            },
          },
        },
      });
    }

    // Find the cart item for the given item and user cart
    let cartItem = await prisma.CartItemsTBL.findFirst({
      where: {
        carttid: {
          cartid: userCart.cartid,
        },
        itemids: {
          itemid: itemId,
        },
      },
    });

    if (cartItem) {
      // If the cart item exists, increase the quantity
      cartItem = await prisma.CartItemsTBL.update({
        where: {
          cartitemid: cartItem.cartitemid,
        },
        data: {
          quanity: cartItem.quanity + 1,
        },
      });
    } else {
      // If the cart item doesn't exist, create a new cart item
      cartItem = await prisma.CartItemsTBL.create({
        data: {
          itemsize: size,
          carttid: {
            connect: {
              cartid: userCart.cartid,
            },
          },
          itemids: {
            connect: {
              itemid: itemId,
            },
          },
          quanity: 1,
        },
      });
    }

    res.json({
      message: "Added to cart successfully",
      userCart: userCart,
      availableOfficeBoys: availableOfficeBoys,
      cartItem: cartItem,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.editItemInCart = async (req, res, next) => {
  const itemId = req.params.itemId;
  const incOrDec = req.body.incOrDec;
  try {
    const user = await prisma.EmployeeTBL.findUnique({
      where: {
        empid: req.userId,
      },
    });
    if (!user) {
      const error = new Error("Not authorized to add items to cart");
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

    let cartItem = await prisma.CartItemsTBL.findFirst({
      where: {
        carttid: {
          cartid: userCart.cartid,
        },
        itemids: {
          itemid: itemId,
        },
      },
    });

    if (cartItem) {
      const quanity = cartItem.quanity;
      console.log("quantity :", quanity);
      // If the cart item exists,Check for the quantaty the quantity
      if (incOrDec == 1) {
        if (quanity < 5) {
          cartItem = await prisma.CartItemsTBL.update({
            where: {
              cartitemid: cartItem.cartitemid,
            },
            data: {
              quanity: cartItem.quanity + 1,
            },
          });
          console.log("incresed");
          res.status(200).json({
            message: "Item increased in Cart ",
            DecOrInc: incOrDec,
            Item: cartItem,
          });
        } else {
          res.status(403).json({ message: "You can not Increase any more" });
        }
      } else if (incOrDec == 0) {
        if (quanity > 0) {
          cartItem = await prisma.CartItemsTBL.update({
            where: {
              cartitemid: cartItem.cartitemid,
            },
            data: {
              quanity: cartItem.quanity - 1,
            },
          });
          console.log("decreased");
          res.status(200).json({
            message: "Item decresed in Cart ",
            DecOrInc: incOrDec,
            Item: cartItem,
          });
        } else {
          res.status(403).json({ message: "You can not decrease any more" });
        }
      }
    } else {
      const error = new Error("There is no item to edit on");
      error.statusCode = 404;
      throw error;
    }
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.deleteItemFromCart = async (req, res, next) => {
  const itemId = req.body.itemId;
  try {
    const user = await prisma.EmployeeTBL.findUnique({
      where: {
        empid: req.userId,
      },
    });
    if (!user) {
      const error = new Error("Not authorized to delete items from cart");
      error.statusCode = 404;
      throw error;
    }

    let userCart = await prisma.CartTBL.findFirst({
      where: {
        employeeid: {
          empid: user.empid,
        },
        CartItems: {
          cartitemid: itemId,
        },
      },
    });
    let cartItem = await prisma.CartItemsTBL.findFirst({
      where: {
        itemids: {
          itemid: itemId,
        },
      },
    });
    if (!cartItem) {
      res
        .status(404)
        .json({ message: "Item Doesnot  Exist in the cart to be deleted" });
      const error = new Error("Item Doesnot  Exist in the cart to be deleted");
      error.statusCode = 404;
      throw error;
    } else {
      if (userCart.empid !== req.userId) {
        const error = new Error(
          "You Are not allowed to Delete this item from cart"
        );
        error.statusCode = 403;
        throw error;
      }
      const deletedItemFromCategory = await prisma.CartItemsTBL.delete({
        where: {
          cartitemid: cartItem.cartitemid,
        },
      });
      console.log(userCart.empid, "deleted From cart");
      console.log("Item deleted successfuly from cart!");
      res.status(200).json({
        message: "Item deleted Successfuly from cart",
        deletedItem: deletedItemFromCategory,
      });
    }
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
