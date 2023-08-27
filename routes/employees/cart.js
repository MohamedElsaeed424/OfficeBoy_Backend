const express = require("express");
const { body } = require("express-validator");
const { PrismaClient } = require("@prisma/client");
const isAuth = require("../../middleware/is-auth");

const cartController = require("../../controllers/employees/cart");

const router = express.Router();
const prisma = new PrismaClient();

router.get("/cart-Items", isAuth, cartController.getCartItems);

router.post("/cart-Item", isAuth, cartController.addItemsToCart);

router.put("/edit-site-cart", isAuth, cartController.editSiteInCart);

router.put("/cart-Item/:ItemId", isAuth, cartController.editItemInCart);

router.delete("/cart-Item/:ItemId", isAuth, cartController.deleteItemFromCart);

module.exports = router;
