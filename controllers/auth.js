const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.signup = async (req, res, next) => {
  const fname = req.body.fname;
  const lname = req.body.lname;
  const email = req.body.email;
  const role = req.body.role;
  const password = req.body.password;
  //---------------------------Validations--------------------------
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Please Try again , Validation Failed");
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }
  //-------------------------Hashing The Password for security------------------
  try {
    const hashedPassword = await bcrypt.hash(password, 12);
    // add user

    res.status(201).json({ message: "User Created Successfully", userId: user._id });
    
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
