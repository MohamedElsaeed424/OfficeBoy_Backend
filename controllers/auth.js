const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

exports.signup = async (req, res, next) => {
  const firstname = req.body.firstname;
  const lastname = req.body.lastname;
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
    const newUser = await prisma.UsersTBL.create({
      data: {
        firstname: firstname,
        lastname: lastname,
        email: email,
        role: role,
        password: hashedPassword,
      },
    });
    console.log(newUser);
    console.log(newUser.userId);
    res
      .status(201)
      // connect with Front end...
      .json({ message: "User Created Successfully", userId: newUser.userid });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
