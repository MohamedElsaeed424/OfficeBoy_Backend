const { validationResult } = require("express-validator");
const path = require("path");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const sgMail = require("@sendgrid/mail");
const markdown = require("markdown-it")();
const TokenHandler = require("../../util/TokenHandler");
const express = require("express"); //new
const { off } = require("process");
const { use } = require("passport");
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

  //---------------------------Validations--------------------------
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // console.log(errors);
      const error = new Error("Please Try again , Validation Failed");
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }

    //-------------------------Hashing The Password for security------------------

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
      } else if (RoleCheck.rolename == "office Boy") {
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
            roleref: {
              connect: {
                roleid: parseInt(roleId),
              },
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
        const createdUpcomming = await prisma.UpcomingTBL.create({
          data: {
            officeboyref: {
              connect: {
                officeboyid: newOfficeBoy.officeboyid,
              },
            },
          },
        });
        const createdFinished = await prisma.FinishingTBL.create({
          data: {
            officeboyref: {
              connect: {
                officeboyid: newOfficeBoy.officeboyid,
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
            UpcommingList: createdUpcomming,
            FinishingList: createdFinished,
          });
      } else {
        res.status(403).json({
          message: "you selected Invalid Role , see again the available roles",
        });
        const error = new Error(
          "you selected Invalid Role , see again the available roles"
        );
        error.statusCode = 403;
        error.data = errors.array();
        throw error;
      }
    }
    // sgMail.send({
    //   to: email,
    //   from: "postman.mord@gmail.com",
    //   subject: "Your Signup to postman succeeded!",
    //   html: emailDesignHtml,
    // });
  } catch (err) {
    console.log(err);
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
  if (req.userId) {
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
        res.status(404).json({ message: "User Not Found , Try Signup" });
        const error = new Error("User Not Found , Try Signup");
        error.statusCode = 404;
        throw error;
      }
      const doMatch = await bcrypt.compare(password, user.password);
      if (!doMatch) {
        res.status(401).json({ message: "Wrong Password" });
        const error = new Error("Wrong Password");
        error.statusCode = 401;
        throw error;
      }
      //-------------------------------- Adding JWT (json web token) for a user -----------------------
      const accessToken = await TokenHandler.generateAccessToken({
        userid: user.userid,
      });
      const refreshToken = await TokenHandler.generateRefreshToken({
        userid: user.userid,
      });
      console.log(refreshToken, user.userid);
      //-------------------------------------------------------------------------------------------
      res.status(200).json({
        accessToken: accessToken,
        refreshToken: refreshToken,
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

exports.logout = async (req, res, next) => {
  try {
    const refreshToken = req.body.refreshToken;
    const fetchedRefToken = await prisma.TokensTBL.findUnique({
      where: {
        token: refreshToken,
      },
    });
    if (!fetchedRefToken) {
      res.status(404).json({
        message: "You are not autherized , token not found",
      });
      const error = new Error("You are not autherized , token not found");
      error.statusCode = 404;
      throw error;
    }
    const deletedRefToken = await prisma.tokensTBL.delete({
      where: {
        token: refreshToken,
      },
    });
    const deletedAccessToken = await prisma.tokensTBL.delete({
      where: {
        token: req.accessToken,
      },
    });

    if (!deletedRefToken || !deletedAccessToken) {
      res.status(401).json({ message: "No user exsist now to logout" });
      const error = new Error("No user exsist now to logout");
      error.statusCode = 404;
      throw error;
    }
    res.status(202).json({
      message: "User Logedout",
      deletedAccessToken: deletedAccessToken,
      deletedRefToken: deletedRefToken,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
    return err;
  }
};

exports.refreshTheToken = async (req, res, next) => {
  try {
    const refreshToken = req.body.refreshToken;
    console.log("req.AccessToken", req.accessToken);
    const fetchedRefToken = await prisma.TokensTBL.findUnique({
      where: {
        token: refreshToken,
      },
    });
    if (!fetchedRefToken) {
      res.status(404).json({
        message: "You are not autherized , token not found",
      });
      const error = new Error("You are not autherized , token not found");
      error.statusCode = 404;
      throw error;
    }
    jwt.verify(
      fetchedRefToken.token,
      "MY_REFRESH_SECRET_TOKEN_GENERATED",
      async (err, user) => {
        // console.log(err);
        if (err) return res.status(404).json({ message: "Token expried" });
        if (fetchedRefToken.blackListedToken) {
          res
            .status(403)
            .json({ message: "You are blocked , we cant refresh your token" });
          const error = new Error(
            "You are blocked , we cant refresh your token"
          );
          error.statusCode = 403;
          throw error;
        }
        const deletedRefToken = await prisma.tokensTBL.delete({
          where: {
            token: fetchedRefToken.token,
          },
        });
        const deletedAccessToken = await prisma.tokensTBL.delete({
          where: {
            token: req.accessToken,
          },
        });
        const accessToken = await TokenHandler.generateAccessToken({
          userid: user.userId,
        });
        const refreshToken = await TokenHandler.generateRefreshToken({
          userid: user.userId,
        });
        res.status(202).json({
          message: "Token Refreshed Successfully",
          accessToken: accessToken,
          refreshToken: refreshToken,
        });
      }
    );
  } catch (err) {
    console.log(err);
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
    return err;
  }
};
