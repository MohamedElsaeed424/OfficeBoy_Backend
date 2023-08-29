const express = require("express");
const { body } = require("express-validator");
const isAuth = require("../../middleware/is-auth");
const categoriesController = require("../../controllers/admin/categories");
const router = express.Router();

router.post(
  "/add-category",
  [
    body("category")
      .trim()
      .not()
      .isEmpty()
      .isLength({ min: 5 })
      .withMessage("Please enter valid category name  , minmum 5 characters")
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
            " category name should contains only upper and lower cases characters."
          );
        }
      }),
  ],
  isAuth,
  categoriesController.addCategory
);

router.get("/categories", categoriesController.getCategories);

router.put(
  "/edit-category/:categoryId",
  [
    body("categoryName")
      .trim()
      .not()
      .isEmpty()
      .isLength({ min: 5 })
      .withMessage("Please enter valid category name  , minmum 5 characters")
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
            " category name should contains only upper and lower cases characters."
          );
        }
      }),
  ],
  isAuth,
  categoriesController.updateCategory
);

router.delete(
  "/delete-category/:categoryId",
  isAuth,
  categoriesController.deleteCategory
);

module.exports = router;
