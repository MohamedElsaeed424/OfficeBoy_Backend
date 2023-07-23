const express = require("express");
const { body } = require("express-validator");
const { PrismaClient } = require("@prisma/client");

const authController = require("../controllers/auth");

const router = express.Router();
const prisma = new PrismaClient();

router.put(
  "/signup",
  [
    body("email")
      .isEmail()
      .withMessage("Please Enter a Valid Email")
      .normalizeEmail()
      //-------------------------If The User Already exist--------------------------------------------
      .custom(async (value, { req }) => {
        const user = await prisma.UsersTBL.findUnique({
          where: {
            email: value,
          },
        });
        if (user) {
          console.log("cannot add user ,User already exist");
          return Promise.reject(
            "Email address ALready Exist ,Please Enter another One."
          );
        }
      }),
    //------------------------------------------------------------------
    body("password").isLength({ min: 5 }).isAlphanumeric().trim(),
    body("firstname").trim().not().isEmpty(),
    body("lastname").trim().not().isEmpty(),
    body("role").trim().not().isEmpty(),
  ],
  authController.signup
);

router.post("/login", authController.login);

router.post("/logout", authController.logout);

module.exports = router;
