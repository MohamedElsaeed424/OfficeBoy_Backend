const express = require("express");
const { body } = require("express-validator");
const { PrismaClient } = require("@prisma/client");
const isAuth = require("../../middleware/is-auth");
const checkRequestBody = require("../../middleware/bodyDataChecker");

const cartController = require("../../controllers/employees/cart");

const router = express.Router();
const prisma = new PrismaClient();

router.get("/cart-Items", isAuth, cartController.getCartItems);

router.post(
  "/add-cart-Item",
  [
    body("Notes")
      .trim()
      .isLength({ min: 5 })
      .withMessage("Please enter valid room name , minimum 5 characters")
      .custom(async (value, { req }) => {
        var format = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
        var checkValue = false;
        if (format.test(value)) {
          checkValue = true;
        } else {
          checkValue = false;
        }
        console.log(checkValue);
        if (checkValue == true) {
          return Promise.reject(
            "Notes should contains only upper and lower cases characters."
          );
        }
      }),
  ],

  isAuth,
  checkRequestBody,
  cartController.addItemsToCart
);

router.put(
  "/edit-site-cart",
  isAuth,
  checkRequestBody,
  cartController.editSiteInCart
);

router.put(
  "/cart-Item/:ItemId",
  isAuth,
  checkRequestBody,
  cartController.editItemInCart
);

router.delete("/cart-Item/:ItemId", isAuth, cartController.deleteItemFromCart);

module.exports = router;
