const express = require("express");
const { body } = require("express-validator");
const { PrismaClient } = require("@prisma/client");
const isAuth = require("../middleware/is-auth");

const cartController = require("../controllers/cart");

const router = express.Router();
const prisma = new PrismaClient();

router.get("/cart-Items/:cartId", isAuth, cartController.getCartItems);

router.post("/cart-Item", isAuth, cartController.addItemsToCart);

router.put("/cart-Item/:ItemId", isAuth, cartController.editItemInCart);

module.exports = router;
