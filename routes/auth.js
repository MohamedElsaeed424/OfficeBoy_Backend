const express = require("express") ;

const router = express.Router ;


router.put(
    "/signup",
    [
      body("email")
        .isEmail()
        .withMessage("Please Enter a Valid Email")
        .normalizeEmail()
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
      ,
      body("password").isLength({ min: 5 }).isAlphanumeric().trim(),
      body("name").trim().not().isEmpty(),
    ],
    authController.signup
);

module.exports = router ;