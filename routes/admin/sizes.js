const express = require("express");
const { body } = require("express-validator");
const isAuth = require("../../middleware/is-auth");
const sizesController = require("../../controllers/admin/sizes");
const router = express.Router();

router.post(
  "/add-size",
  [
    body("sizeName")
      .trim()
      .not()
      .isEmpty()
      .isLength({ max: 4 })
      .withMessage("Please enter valid size name  , maximum 4 characters")
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
            "size name should contains only upper and lower cases characters."
          );
        }
      }),
  ],
  isAuth,
  sizesController.addSize
);

// used in signup
router.get("/get-sizes", isAuth, sizesController.getSizes);

module.exports = router;
