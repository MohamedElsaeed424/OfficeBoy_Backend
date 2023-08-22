const express = require("express");
const { PrismaClient } = require("@prisma/client");

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

// POST new cart with items
exports.addItemsToCart = async (req, res, next) => {
  const itemId = req.body.itemId;

  try {
    // Find the user by userid
    const user = await prisma.EmployeeTBL.findUnique({
      where: {
        empid: req.userId,
      },
    });
    console.log(user.empid + " added to cart");
    if (!user) {
      const error = new Error("Not otherized to add items to cart");
      error.statusCode = 404;
      throw error;
    }
    // Create a new record in the cartTBL with empId
    const userWithCart = await prisma.EmployeeTBL.findUnique({
      where: {
        empid: req.userId,
      },
      include: { Cart: true },
    });
    let newCart;
    if (!userWithCart) {
      newCart = await prisma.CartTBL.create({
        data: {
          employeeid: {
            connect: {
              empid: user.empid,
            },
          },
        },
      });
    } else {
      newCart = await prisma.CartTBL.update({
        where: {
          cartid: userWithCart.cartid,
        },
        data: {
          employeeid: {
            connect: {
              empid: user.empid,
            },
          },
        },
      });
    }
    const newCartItems = await prisma.CartItemsTBL.create({
      data: {
        carttid: {
          connect: {
            cartid: newCart.cartid,
          },
        },
        itemids: {
          connect: {
            itemid: itemId,
          },
        },
      },
      // include: { CartItems: true },
    });
    res.json({
      message: "added to cart successfully",
      newCart: newCart,
      newCartItems: newCartItems,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.editItemInCart = async (req, res, next) => {
  const itemId = req.params.ItemId;

  try {
    const item = await prisma.CartItemsTBL.findUnique({
      where: {
        itemid: itemId,
      },
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
