const { validationResult } = require("express-validator");
const path = require("path");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const sgMail = require("@sendgrid/mail");
const markdown = require("markdown-it")();

const express = require("express"); //new
const app = express(); //new

sgMail.setApiKey(
  "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"
);

const bathText = path.join(__dirname, "Emai_Design.html");
const emailDesignHtml = markdown.render(bathText);

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

    res
      .status(201)
      // connect with Front end...
      .json({ message: "User Created Successfully", userId: newUser.userid });
    sgMail.send({
      to: email,
      from: "postman.mord@gmail.com",
      subject: "Your Signup to postman succeeded!",
      html: emailDesignHtml,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
//--------------------login logic----------------------------

exports.login = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  try {
    const user = await prisma.UsersTBL.findUnique({
      where: {
        email: email,
      },
    });
    if (!user) {
      const error = new Error("User Not Found , Try Signup");
      error.statusCode = 404;
      throw error;
    }
    const doMatch = await bcrypt.compare(password, user.password);
    if (!doMatch) {
      const error = new Error("Wrong Password");
      error.statusCode = 401;
      throw error;
    }
    //-------------------------------- Adding JWT (json web token) for a user -----------------------
    const token = jwt.sign(
      { email: user.email, userId: user.userid.toString() },
      "MY_SECRET_TOKEN_GENERATED",
      { expiresIn: "1h" }
    );
    //-------------------------------------------------------------------------------------------
    res.status(200).json({ token: token, userId: user.userid.toString() });
    console.log(`${email}: Loged in successfully`);
    return;
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
    return err;
  }
};

// exports.logout = async (req, res, next) => {
//   const token = req.body.token;
//   blacklistToken(token);
//   res.json({ message: "Logout successful" });
//   console.log("user loged out");
// };

// async function blacklistToken(token) {
//   checkBlacklist(token);
//   console.log(token);
//   await prisma.BlacklistedToken.create({
//     data: {
//       token: token,
//     },
//   });
// }

// async function checkBlacklist(req, res, next, token) {
//   const blacklistedToken = await prisma.BlacklistedToken.findUnique({
//     where: {
//       token: token,
//     },
//   });
//   if (blacklistedToken) {
//     return res.status(401).json({ message: "Invalid token" });
//   } else {
//     next();
//   }
// }
