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
  const { CartItems } = req.body;
  const itemId = req.body.itemId;
  try {
    // Find the user by userid
    const user = await prisma.UsersTBL.findUnique({
      where: {
        userid: req.userId,
      },
    });
    // Create a new record in the cartTBL with empId
    const newCart = await prisma.CartItemsTBL.create({
      data: {
        cartitemid: itemId,
        employeeid: {
          connect: {
            empid: req.userId,
          },
        },
      },
      include: { CartItems: true },
    });
    res.json({ message: "added to cart successfully", newCart: newCart });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
