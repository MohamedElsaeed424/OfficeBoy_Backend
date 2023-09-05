const express = require("express");
const { body, check } = require("express-validator");
const dns = require("dns");
const { PrismaClient } = require("@prisma/client");
const emailDomainValidator = require("../../middleware/emails/domainValidator");
const checkRequestBody = require("../../middleware/bodyDataChecker");
const englishValidator = require("../../middleware/emails/englishValidator");

const authController = require("../../controllers/auth/auth");
const { isValidUrl } = require("../../middleware/isValidURL");

const router = express.Router();
const prisma = new PrismaClient();

router.post(
  "/signup",
  checkRequestBody,
  [
    body("email")
      .not()
      .isEmpty()
      .withMessage("email can not be empty")
      .isEmail()
      .withMessage("Please Enter a Valid Email")

      // .normalizeEmail()
      //-------------------------If The User Already exist--------------------------------------------
      .custom(async (value, { req }) => {
        if (req.body.email) {
          const user = await prisma.UsersTBL.findUnique({
            where: {
              email: value,
            },
          });
          if (user) {
            return Promise.reject(
              "Email address ALready Exist ,Please Enter another One."
            );
          }
        }
      }),
    emailDomainValidator,
    englishValidator,

    //------------------------------------------------------------------
    check("password")
      .isStrongPassword({
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
        returnScore: false,
        pointsPerUnique: 1,
        pointsPerRepeat: 0.5,
        pointsForContainingLower: 10,
        pointsForContainingUpper: 10,
        pointsForContainingNumber: 10,
        pointsForContainingSymbol: 10,
      })
      .trim()
      .withMessage(
        "Password should be combination of one uppercase , one lower case, one special char, one digit and min 8 , max 20 char long"
      )
      .not()
      .isEmpty()
      .withMessage("Password can not be empty")
      .isLength({ min: 8 })
      .withMessage("length of the password should be minimum 8 characters "),
    body("firstname")
      .trim()
      .not()
      .isEmpty()
      .isLength({ max: 50 })
      .withMessage("Please enter valid firstname , minmum 5 characters")
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
            "first name should contains only upper and lower cases characters."
          );
        }
      }),
    body("lastname")
      .trim()
      .not()
      .isEmpty()
      .isLength({ max: 50 })
      .withMessage("Please enter valid lastname , minmum 5 characters")
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
            "first name should contains only upper and lower cases characters."
          );
        }
      }),
    // body("roleId")
    //   .trim()
    //   // .not()
    //   // .isEmpty()
    //   // .withMessage("roleId cant be empty ,Please select roleId")
    //   .isNumeric()
    //   .withMessage("roleId must be number"),
    // check("siteId")
    //   .trim()
    //   // .not()
    //   // .isEmpty()
    //   // .withMessage("siteId cant be empty ,Please select siteId")
    //   .isNumeric()
    //   .withMessage("siteId must be number"),
    // body("buildingId")
    //   .trim()
    //   // .not()
    //   // .isEmpty()
    //   // .withMessage("buildingId cant be empty ,Please select buildingId")
    //   .isInt()
    //   .withMessage("buildingId must be number"),
    // body("officeId")
    //   .trim()
    //   // .not()
    //   // .isEmpty()
    //   // .withMessage("officeId cant be empty ,Please select officeId")
    //   .isNumeric()
    //   .withMessage("officeId must be number"),
    // body("departmentId")
    //   .trim()
    //   // .not()
    //   // .isEmpty()
    //   // .withMessage("departmentId cant be empty ,Please select departmentId")
    //   .isNumeric()
    //   .withMessage("departmentId must be number"),
    // body("roomId")
    //   .trim()
    //   // .not()
    //   // .isEmpty()
    //   // .withMessage("roomId cant be empty ,Please select roomId")
    //   .isNumeric()
    //   .withMessage("roomId must be number"),
  ],

  authController.signup
);

router.post(
  "/login",
  checkRequestBody,
  [
    body("email").not().isEmpty().withMessage("email can not be empty"),
    body("password").not().isEmpty().withMessage("password can not be empty"),
  ],

  authController.login
);

router.delete("/logout", authController.logout);

module.exports = router;
