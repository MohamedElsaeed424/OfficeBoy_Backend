const express = require("express");
const { body } = require("express-validator");
const isAuth = require("../../middleware/is-auth");
const checkRequestBody = require("../../middleware/bodyDataChecker");
const domainsController = require("../../controllers/admin/domains");
const router = express.Router();

router.post(
  "/add-domain",
  checkRequestBody,
  [
    body("domainName")
      .trim()
      .not()
      .isEmpty()
      .isLength({ max: 70 })
      .withMessage("Please enter valid domain name  , maximum 70 characters")
      .custom(async (value, { req }) => {
        var format = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,<>\/?~]/;
        var checkValue = false;
        if (format.test(value)) {
          checkValue = true;
        } else {
          checkValue = false;
        }
        console.log(checkValue);
        if (checkValue == true) {
          return Promise.reject(
            "domin name should contains only upper and lower cases characters."
          );
        }
      }),
  ],
  isAuth,

  domainsController.addDomain
);

module.exports = router;
