const { validationResult } = require("express-validator");
const path = require("path");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const sgMail = require("@sendgrid/mail");
const markdown = require("markdown-it")();

const express = require("express"); //new
const { off } = require("process");
const app = express(); //new

// sgMail.setApiKey(
//   "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"
// );

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
  // const roleName = req.body.role;
  const roleId = req.body.roleId;
  const password = req.body.password;
  const siteId = req.body.siteId;
  const buildingId = req.body.buildingId;
  const officeId = req.body.officeId;
  const departmentId = req.body.departmentId;
  const roomId = req.body.roomId;
  console.log(siteId);
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
    const isThereAnyRols = await prisma.RoleTBL.findMany();
    if (isThereAnyRols.length == 0) {
      const newUser = await prisma.UsersTBL.create({
        data: {
          firstname: firstname,
          lastname: lastname,
          email: email,
          password: hashedPassword,
          roleref: {
            create: {
              rolename: "Admin",
            },
          },
        },
      });
      res
        .status(201)
        // connect with Front end...
        .json({ message: "User Created Successfully", userId: newUser.userid });
    } else {
      const RoleCheck = await prisma.RoleTBL.findUnique({
        where: {
          roleid: parseInt(roleId),
        },
      });
      if (!RoleCheck) {
        res.status(403).json({ message: "This Role Dose't Exist" });
        const error = new Error("This Role Dose't Exist");
        error.statusCode = 403;
        error.data = errors.array();
        throw error;
      }
      if (RoleCheck.rolename == "employee") {
        // Check if the data exisit or not
        const siteCheck = await prisma.SiteTBL.findUnique({
          where: {
            siteid: parseInt(siteId),
          },
        });
        const buildingCheck = await prisma.BuildingTBL.findUnique({
          where: {
            buildingid: parseInt(buildingId),
          },
        });
        const officeCheck = await prisma.OfficeTBL.findUnique({
          where: {
            officeid: parseInt(officeId),
          },
        });
        const departmentCheck = await prisma.DepartmentTBL.findUnique({
          where: {
            departmentid: parseInt(departmentId),
          },
        });
        const roomCheck1 = await prisma.RoomTBL.findUnique({
          where: {
            roomid: parseInt(roomId),
          },
        });
        if (!siteCheck) {
          res.status(403).json({ message: "This Site Dose't Exist" });
          const error = new Error("This Site Dose't Exist");
          error.statusCode = 403;
          error.data = errors.array();
          throw error;
        }
        if (!buildingCheck) {
          res.status(403).json({ message: "This Building Dose't Exist" });
          const error = new Error("This Building Dose't Exist");
          error.statusCode = 403;
          error.data = errors.array();
          throw error;
        }
        if (!officeCheck) {
          res.status(403).json({ message: "This Office Dose't Exist" });
          const error = new Error("This Office Dose't Exist");
          error.statusCode = 403;
          error.data = errors.array();
          throw error;
        }
        if (!departmentCheck) {
          res.status(403).json({ message: "This Department Dose't Exist" });
          const error = new Error("This Department Dose't Exist");
          error.statusCode = 403;
          error.data = errors.array();
          throw error;
        }
        if (!roomCheck1) {
          res.status(403).json({ message: "This Room Number  Dose't Exist" });
          const error = new Error("This Room Number  Dose't Exist");
          error.statusCode = 403;
          error.data = errors.array();
          throw error;
        }
        // create employye
        const newUser = await prisma.UsersTBL.create({
          data: {
            firstname: firstname,
            lastname: lastname,
            email: email,
            password: hashedPassword,
            roleref: {
              connect: {
                roleid: parseInt(roleId),
              },
            },
          },
        });
        const newEmployee = await prisma.EmployeeTBL.create({
          data: {
            emp: {
              connect: {
                userid: newUser.userid,
              },
            },
            sitid: {
              connect: {
                siteid: parseInt(siteId),
              },
            },
            bulidingref: {
              connect: {
                buildingid: parseInt(buildingId),
              },
            },
            offid: {
              connect: {
                officeid: parseInt(officeId),
              },
            },
            departmentref: {
              connect: {
                departmentid: parseInt(departmentId),
              },
            },
            romid: {
              connect: {
                roomid: parseInt(roomId),
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
        //---------------------Check Admin Role---------------------------------
      } else if (RoleCheck.rolename == "Admin") {
        const newUser = await prisma.UsersTBL.create({
          data: {
            firstname: firstname,
            lastname: lastname,
            email: email,
            password: hashedPassword,
            roleref: {
              connect: {
                roleid: parseInt(roleId),
              },
            },
          },
        });
        res
          .status(201)
          // connect with Front end...
          .json({
            message: "User Created Successfully",
            userId: newUser.userid,
          });
      } else if (roleName == "office Boy") {
        const siteCheck = await prisma.SiteTBL.findUnique({
          where: {
            siteid: parseInt(siteId),
          },
        });
        const officeCheck = await prisma.OfficeTBL.findUnique({
          where: {
            officeid: parseInt(officeId),
          },
        });
        if (!siteCheck) {
          res.status(403).json({ message: "This Site Dose't Exist" });
          const error = new Error("This Site Dose't Exist");
          error.statusCode = 403;
          error.data = errors.array();
          throw error;
        }
        if (!officeCheck) {
          res.status(403).json({ message: "This Office Dose't Exist" });
          const error = new Error("This Office Dose't Exist");
          error.statusCode = 403;
          error.data = errors.array();
          throw error;
        }
        const newUser = await prisma.UsersTBL.create({
          data: {
            firstname: firstname,
            lastname: lastname,
            email: email,
            password: hashedPassword,
          },
          roleref: {
            connect: {
              roleid: parseInt(roleId),
            },
          },
        });
        const newOfficeBoy = await prisma.OfficeBoyTBL.create({
          data: {
            officeboy: {
              connect: {
                userid: newUser.userid,
              },
            },
            siteref: {
              connect: {
                siteid: parseInt(siteId),
              },
            },
            offid: {
              connect: {
                officeid: parseInt(officeId),
              },
            },
          },
        });
        res
          .status(201)
          // connect with Front end...
          .json({
            message: "User Created Successfully",
            userId: newOfficeBoy.officeboyid,
          });
      }
    }

    // sgMail.send({
    //   to: email,
    //   from: "postman.mord@gmail.com",
    //   subject: "Your Signup to postman succeeded!",
    //   html: emailDesignHtml,
    // });
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
  console.log(req.userId);
  if (req.userId !== undefined) {
    res
      .status(403)
      .json({ message: "You can not login There is user already Exsist" });
    const error = new Error("ou can not login There is user already Exsist");
    error.statusCode = 404;
    throw error;
  } else {
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
  }
};
function generateAccessToken(user) {
  return jwt.sign(
    { email: user.email, userId: user.userid },
    "MY_ACCESS_SECRET_TOKEN_GENERATED",
    { expiresIn: "4h" }
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
