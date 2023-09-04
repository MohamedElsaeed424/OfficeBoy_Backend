const express = require("express");
const { body } = require("express-validator");
const isAuth = require("../../middleware/is-auth");
const checkRequestBody = require("../../middleware/bodyDataChecker");
const statusController = require("../../controllers/admin/status");
const router = express.Router();

router.post(
  "/add-status",
  checkRequestBody,
  [
    body("statusName")
      .trim()
      .not()
      .isEmpty()
      .isLength({ max: 20 })
      .withMessage("Please enter valid Status name  , maximum 20  characters")
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
            " Status name should contains only upper and lower cases characters."
          );
        }
      }),
  ],
  isAuth,
  statusController.addStatus
);

// used in signup
router.get("/get-status", statusController.getAllStatus);

module.exports = router;
