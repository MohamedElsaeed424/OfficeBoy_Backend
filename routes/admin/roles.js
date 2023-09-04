const express = require("express");
const { body } = require("express-validator");
const isAuth = require("../../middleware/is-auth");
const checkRequestBody = require("../../middleware/bodyDataChecker");
const rolesController = require("../../controllers/admin/roles");
const router = express.Router();

router.post(
  "/add-role",
  checkRequestBody,
  [
    body("roleName")
      .trim()
      .not()
      .isEmpty()
      .isLength({ min: 5 })
      .withMessage("Please enter valid role name  , minmum 5 characters")
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
            " role name should contains only upper and lower cases characters."
          );
        }
      }),
  ],
  isAuth,

  rolesController.addRole
);

// used in signup
router.get("/get-roles", rolesController.getRoles);

module.exports = router;
