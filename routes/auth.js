const express = require("express") ;
const { body } = require("express-validator");  

const authController = require("../controllers/auth");

const router = express.Router();

router.put(
    "/signup",
    [
      body("email")
        .isEmail()
        .withMessage("Please Enter a Valid Email")
        .normalizeEmail(),
        //-------------------------If The User Already exist--------------------------------------------
        // .custom((value, { req }) => {
        //   return User.findOne({ email: value }).then((userDoc) => {
        //     if (userDoc) {
        //       return Promise.reject(
        //         "Email address ALready Exist ,Please Enter another One."
        //       );
        //     }
        //   });
        // }),
      //------------------------------------------------------------------
      body("password").isLength({ min: 5 }).isAlphanumeric().trim(),
      body("firstname").trim().not().isEmpty(),
      body("lastname").trim().not().isEmpty(),
      body("role").trim().not().isEmpty(),
    ],
    authController.signup
);

console.log("222");
module.exports = router ;