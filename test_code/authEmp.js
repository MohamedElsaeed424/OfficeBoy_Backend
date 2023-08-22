exports.addItemsToCart = async (req, res, next) => {
  const itemId = req.body.itemId;

  try {
    //Find the user by userid
    const user = await prisma.EmployeeTBL.findUnique({
      where: {
        empid: req.userId,
      },
    });
    console.log(user.empid + " added to cart");
    if (!user) {
      const error = new Error("Not authorized to add items to cart");
      error.statusCode = 404;
      throw error;
    }

    // Find the user's cart or create a new cart if it doesn't exist
    let userCart = await prisma.CartTBL.findFirst({
      where: {
        employeeid: {
          empid: user.empid,
        },
      },
    });

    if (!userCart) {
      userCart = await prisma.CartTBL.create({
        data: {
          employeeid: {
            connect: {
              empid: user.empid,
            },
          },
        },
      });
    }

    // Find the cart item for the given item and user cart
    let cartItem = await prisma.CartItemsTBL.findFirst({
      where: {
        carttid: {
          cartid: userCart.cartid,
        },
        itemids: {
          itemid: itemId,
        },
      },
    });

    if (cartItem) {
      // If the cart item exists, increase the quantity
      cartItem = await prisma.CartItemsTBL.update({
        where: {
          cartitemid: cartItem.cartitemid,
        },
        data: {
          quantity: cartItem.quantity + 1,
        },
      });
    } else {
      // If the cart item doesn't exist, create a new cart item
      cartItem = await prisma.CartItemsTBL.create({
        data: {
          carttid: {
            connect: {
              cartid: userCart.cartid,
            },
          },
          itemids: {
            connect: {
              itemid: itemId,
            },
          },
          quantity: 1,
        },
      });
    }

    res.json({
      message: "Added to cart successfully",
      userCart: userCart,
      cartItem: cartItem,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
////////////////cart upsert///////////////

// exports.addItemsToCart = async (req, res, next) => {
//   const itemId = req.body.itemId;
//   try {
//     const userCart = await prisma.CartTBL.upsert({
//       where: {
//         empid: req.userid,
//       },
//       update: {},
//       create: {
//         employee: {
//           connect: {
//             empid: req.userid,
//           },
//         },
//         CartItems: {
//           create: {
//             itemids: {
//               connect: {
//                 itemid: itemId,
//               },
//             },
//           },
//         },
//       },
//       include: {
//         cartItems: {
//           include: {
//             itemids: true,
//           },
//         },
//       },
//     });

//     res.json({
//       message: "Added to cart successfully",
//       cart: userCart,
//     });
//   } catch (err) {
//     if (!err.statusCode) {
//       err.statusCode = 500;
//     }
//     next(err);
//   }
// };
///////////////////////////////////////////
// const { validationResult } = require("express-validator");
// const path = require("path");
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
// const { PrismaClient } = require("@prisma/client");
// const prisma = new PrismaClient();
// const sgMail = require("@sendgrid/mail");
// const markdown = require("markdown-it")();

// const express = require("express"); //new
// const app = express(); //new

// sgMail.setApiKey(
//     "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"
// );

// const bathText = path.join(__dirname, "Email_Design.html");
// const emailDesignHtml = markdown.render(bathText);

// const catchAsync = (fn) => (req, res, next) => {
//     return Promise.resolve(fn(req, res, next)).catch((err) => next(err));
// };

// exports.signup = catchAsync(async (req, res, next) => {
//     try {
//         const newEmp = await prisma.EmployeeTBL.create({
//             data: {
//                 romid: {
//                     connect: {
//                         roomid: req.roomId,
//                     },
//                 },
//                 offid: {
//                     connect: {
//                         officeid: req.officeId,
//                     },
//                 },
//                 emp: {
//                     connect: {
//                         userid: req.userId,
//                     },
//                 },
//             },
//         });
//         console.log(newEmp);

//         res
//             .status(201)
//             // connect with Front end...
//             .json({ message: "User Created Successfully", userId: newUser.userid });
//         sgMail.send({
//             to: email,
//             from: "postman.mord@gmail.com",
//             subject: "Your Signup to postman succeeded!",
//             html: emailDesignHtml,
//         });
//     } catch (err) {
//         throw new Error(400, err.message);
//     }
// });
