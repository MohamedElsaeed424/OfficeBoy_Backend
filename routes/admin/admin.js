const express = require("express");

const isAuth = require("../../middleware/is-auth");
const checkRequestBody = require("../../middleware/bodyDataChecker");
const adminController = require("../../controllers/admin/admin");
const { body } = require("express-validator");
const router = express.Router();

router.post(
  "/add-item",
  [
    body("itemname")
      .trim()
      .not()
      .isEmpty()
      .isLength({ max: 30 })
      .withMessage("Please enter valid item name , maximum 30 characters")
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
            "item name should contains only upper and lower cases characters."
          );
        }
      }),
    // body("category")
    //   .trim()
    //   .not()
    //   .isEmpty()
    //   .withMessage("categoryId cant be empty ,Please select categoryId")
    //   .isNumeric()
    //   .withMessage("categoryId must be number"),
    body("description")
      .trim()
      .not()
      .isEmpty()
      .isLength({ max: 50 })
      .withMessage("Please enter valid description , maximum 50 characters")
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
            " discription should contains only upper and lower cases characters."
          );
        }
      }),
  ],
  isAuth,
  checkRequestBody,
  adminController.addItem
);

router.delete("/item/:itemId", isAuth, adminController.deleteItem);

router.put(
  "/item/:itemId",
  [
    body("itemName")
      .trim()
      .not()
      .isEmpty()
      .isLength({ max: 30 })
      .withMessage("Please enter valid item name , maximum 30 characters")
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
            "item name should contains only upper and lower cases characters."
          );
        }
      }),
    body("category")
      .trim()
      .not()
      .isEmpty()
      .withMessage("categoryId cant be empty ,Please select categoryId")
      .isNumeric()
      .withMessage("categoryId must be number"),
    body("description")
      .trim()
      .not()
      .isEmpty()
      .isLength({ max: 50 })
      .withMessage("Please enter valid description , maximum 50 characters")
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
            " discription should contains only upper and lower cases characters."
          );
        }
      }),
  ],
  isAuth,
  checkRequestBody,
  adminController.updateItem
);

router.get("/item/:itemId", isAuth, adminController.getItem);

module.exports = router;
