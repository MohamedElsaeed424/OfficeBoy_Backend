const { validationResult } = require("express-validator");
const path = require("path");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const sgMail = require("@sendgrid/mail");
const markdown = require("markdown-it")();

const express = require("express"); //new
const app = express(); //new

sgMail.setApiKey(
  "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"
);

const bathText = path.join(__dirname, "Email_Design.html");
const emailDesignHtml = markdown.render(bathText);

// const catchAsync = (fn) => (req, res, next) => {
//   return Promise.resolve(fn(req, res, next)).catch((err) => {
//     console.log(err);
//     next(err);
//   });
// };

const catchAsync = (fn) => (req, res, next) => {
  return Promise.resolve(fn(req, res, next)).catch((err) => next(err));
};

exports.signup = catchAsync(async (req, res, next) => {
  const firstname = req.body.firstname;
  const lastname = req.body.lastname;
  const email = req.body.email;
  const role = req.body.role;
  const password = req.body.password;
  const roomId = req.body.roomId;
  const officeId = req.body.officeId;
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
    if (role == "employee") {
      const newUser = await prisma.UsersTBL.create({
        data: {
          firstname: firstname,
          lastname: lastname,
          email: email,
          role: role,
          password: hashedPassword,
        },
      });
      const newEmployee = await prisma.EmployeeTBL.create({
        data: {
          emp: {
            connect: {
              userid: newUser.userid,
            },
          },
          offid: {
            connect: {
              officeid: officeId,
            },
          },
          romid: {
            connect: {
              roomid: roomId,
            },
          },
        },
      });
      res
        .status(201)
        // connect with Front end...
        .json({
          message: "User Created Successfully",
          userId: newEmployee.empid,
        });
    } else if (role == "admin") {
      const newUser = await prisma.UsersTBL.create({
        data: {
          firstname: firstname,
          lastname: lastname,
          email: email,
          role: role,
          password: hashedPassword,
        },
      });
      res
        .status(201)
        // connect with Front end...
        .json({ message: "User Created Successfully", userId: newUser.userid });
    }
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
    return err;
  }
});
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
    const accessToken = generateAccessToken({ userid: user.userid });
    const refreshToken = jwt.sign(
      { email: user.email, userId: user.userid },
      "MY_REFRESH_SECRET_TOKEN_GENERATED"
    );
    // connection with db
    console.log(refreshToken, user.userid);
    const createdRefToken = await prisma.TokensTBL.create({
      data: {
        refreshtoken: refreshToken,
        // createdAt: new Date(),
        reftoken: {
          connect: {
            userid: user.userid,
          },
        },
      },
    });

    // const createdRefToken = await prisma.TokensTBL.createOne({
    //   data: {
    //     refreshtoken: refreshToken,
    //     createdAt: new Date(),
    //     reftoken: {
    //       connect: {
    //         userid: user.userid,
    //       },
    //     },
    //   },
    //   //data: {
    //   //refreshtoken: refreshToken,
    //   //userid: user.userid,
    //   //createdAt: new Date(),
    //   // connect: {
    //   //   reftoken: {
    //   //     uderid: user.userid,
    //   //   },
    //   // },
    //   // },
    // });
    //-------------------------------------------------------------------------------------------
    res.status(200).json({
      accessToken: accessToken,
      refreshToken: createdRefToken,
      userId: user.userid.toString(),
    });
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
function generateAccessToken(user) {
  return jwt.sign(
    { email: user.email, userId: user.userid },
    "MY_ACCESS_SECRET_TOKEN_GENERATED",
    { expiresIn: "2h" }
  );
}
exports.logout = async (req, res, next) => {
  try {
    const refToken = req.body.refToken;
    deletedRefToken = await prisma.TokensTBL.delete({
      where: {
        refreshtoken: refToken,
      },
    });
    if (!deletedRefToken) {
      const error = new Error("No Refresh token found");
      error.statusCode = 404;
      throw error;
    }
    res.status(202).json({ message: "Token deleted" });
    ``;
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
