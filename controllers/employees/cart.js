// rokia
// try to solve
const express = require("express");
const { PrismaClient } = require("@prisma/client");
const { use } = require("passport");
const { ExtractJwt } = require("passport-jwt");
const { validationResult } = require("express-validator");

const prisma = new PrismaClient();
const app = express();

app.use(express.json());

//find unique user
exports.addItem = async (req, res, next) => {
  const user = await prisma.UsersTBL.findUnique({
    where: {
      userid: req.userId,
    },
  });
  console.log(user);
  console.log(user.userid);
};

// GET cart with its items
exports.getCartItems = async (req, res, next) => {
  try {
    const user = await prisma.EmployeeTBL.findUnique({
      where: {
        empid: req.userId,
      },
    });
    if (!user) {
      const error = new Error("Not authorized to add items to cart");
      error.statusCode = 404;
      throw error;
    }
    let userCart = await prisma.CartTBL.findFirst({
      where: {
        employeeid: {
          empid: user.empid,
        },
      },
      include: { CartItems: true, employeeid: true },
    });
    if (!userCart) {
      res.status(404).json({ message: "Sorry, No Items in cart to be shown" });
      const error = new Error("Sorry, No Items in cart to be shown");
      error.statusCode = 404;
      throw error;
    }
    const site = await prisma.SiteTBL.findUnique({
      where: {
        siteid: userCart.employeeid.siteid,
      },
    });
    const office = await prisma.OfficeTBL.findUnique({
      where: {
        officeid: userCart.employeeid.officeid,
      },
    });
    const room = await prisma.RoomTBL.findUnique({
      where: {
        roomid: userCart.employeeid.roomid,
      },
    });

    res.json({
      message: "cart fetched successfully",
      cart: userCart,
      site: site.sitename,
      office: office.officeno,
      roomName: room.roomname,
      roomNum: room.roomno,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

// // POST new cart with items
exports.addItemsToCart = async (req, res, next) => {
  const itemId = req.body.itemId;
  const sizeId = req.body.sizeId;
  // const officeBoyId = req.body.officeBoyId;
  const notes = req.body.Notes;

  try {
    //---------------------------Validations--------------------------
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error("Please Try again , Validation Failed");
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }

    //Find the user by userid
    const user = await prisma.EmployeeTBL.findUnique({
      where: {
        empid: req.userId,
      },
    });
    if (!user) {
      const error = new Error("Not authorized to add items to cart");
      error.statusCode = 404;
      throw error;
    }

    const sizeCheck = await prisma.SizeTBL.findUnique({
      where: {
        sizeid: sizeId,
      },
    });
    if (!sizeCheck) {
      res.status(403).json({ message: "This size Dose't Exist" });
      const error = new Error("This size Dose't Exist");
      error.statusCode = 403;
      error.data = errors.array();
      throw error;
    }

    // const availableOfficeBoys = await prisma.OfficeBoyTBL.findMany({
    //   where: {
    //     siteref: {
    //       siteid: user.siteid,
    //     },
    //   },
    // });
    // console.log(availableOfficeBoys, "Available Office Boys ");
    // const requestedOfficeBoy = await prisma.officeBoyTBL.findUnique({
    //   where: {
    //     officeboyid: officeBoyId,
    //   },
    // });
    // console.log(requestedOfficeBoy, "Office Boy Selected");
    // let isReqOfficeBoyExist = availableOfficeBoys.includes(requestedOfficeBoy);
    // console.log(isReqOfficeBoyExist);
    // if (isReqOfficeBoyExist) {
    //   res.status(403).json({
    //     message:
    //       "Sorry, You can not select this office boy , he OR she maybe not in your site",
    //   });
    //   const error = new Error(
    //     "Sorry, You can not select this office boy ,he OR she maybe not in your site"
    //   );
    //   error.statusCode = 403;
    //   throw error;
    // }
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
      const quanity = cartItem.quanity;
      console.log("quantity :", quanity);
      // If the cart item exists, increase the quantity
      if (quanity < 5) {
        cartItem = await prisma.CartItemsTBL.update({
          where: {
            cartitemid: cartItem.cartitemid,
          },
          data: {
            quanity: cartItem.quanity + 1,
            notes: notes,
          },
        });
      } else {
        res
          .status(403)
          .json({ message: "You can not Add this item to the cart any more" });
      }
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
          sizeref: {
            connect: {
              sizeid: sizeId,
            },
          },
          quanity: 1,
          notes: notes,
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

exports.editItemInCart = async (req, res, next) => {
  const itemId = req.params.itemId;
  const incOrDec = req.body.incOrDec;
  try {
    const user = await prisma.EmployeeTBL.findUnique({
      where: {
        empid: req.userId,
      },
    });
    if (!user) {
      const error = new Error(
        "Not authorized to add items to cart , Should login first"
      );
      error.statusCode = 404;
      throw error;
    }
    let userCart = await prisma.CartTBL.findFirst({
      where: {
        employeeid: {
          empid: user.empid,
        },
      },
    });

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
      const quanity = cartItem.quanity;
      console.log("quantity :", quanity);
      // If the cart item exists,Check for the quantaty the quantity
      if (incOrDec == 1) {
        if (quanity < 5) {
          cartItem = await prisma.CartItemsTBL.update({
            where: {
              cartitemid: cartItem.cartitemid,
            },
            data: {
              quanity: cartItem.quanity + 1,
            },
          });
          console.log("incresed");
          res.status(200).json({
            message: "Item increased in Cart ",
            DecOrInc: incOrDec,
            Item: cartItem,
          });
        } else {
          res.status(403).json({ message: "You can not Increase any more" });
        }
      } else if (incOrDec == 0) {
        if (quanity > 0) {
          cartItem = await prisma.CartItemsTBL.update({
            where: {
              cartitemid: cartItem.cartitemid,
            },
            data: {
              quanity: cartItem.quanity - 1,
            },
          });
          console.log("decreased");
          res.status(200).json({
            message: "Item decresed in Cart ",
            DecOrInc: incOrDec,
            Item: cartItem,
          });
        } else {
          res.status(403).json({ message: "You can not decrease any more" });
        }
      }
    } else {
      const error = new Error("There is no item to edit on");
      error.statusCode = 404;
      throw error;
    }
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.deleteItemFromCart = async (req, res, next) => {
  const itemId = req.body.itemId;
  try {
    const user = await prisma.EmployeeTBL.findUnique({
      where: {
        empid: req.userId,
      },
    });
    if (!user) {
      const error = new Error("Not authorized to delete items from cart");
      error.statusCode = 404;
      throw error;
    }

    let userCart = await prisma.CartTBL.findFirst({
      where: {
        employeeid: {
          empid: user.empid,
        },
        CartItems: {
          cartitemid: itemId,
        },
      },
    });
    let cartItem = await prisma.CartItemsTBL.findFirst({
      where: {
        itemids: {
          itemid: itemId,
        },
      },
    });
    if (!cartItem) {
      res
        .status(404)
        .json({ message: "Item Doesnot  Exist in the cart to be deleted" });
      const error = new Error("Item Doesnot  Exist in the cart to be deleted");
      error.statusCode = 404;
      throw error;
    } else {
      if (userCart.empid !== req.userId) {
        const error = new Error(
          "You Are not allowed to Delete this item from cart"
        );
        error.statusCode = 403;
        throw error;
      }
      const deletedItemFromCategory = await prisma.CartItemsTBL.delete({
        where: {
          cartitemid: cartItem.cartitemid,
        },
      });
      console.log(userCart.empid, "deleted From cart");
      console.log("Item deleted successfuly from cart!");
      res.status(200).json({
        message: "Item deleted Successfuly from cart",
        deletedItem: deletedItemFromCategory,
      });
    }
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.editSiteInCart = async (req, res, next) => {
  try {
    //---------------------------Validations--------------------------
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error("Please Try again , Validation Failed");
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }

    const siteId = req.body.siteId;
    const buildingId = req.body.buildingId;
    const officeId = req.body.officeId;
    const departmentId = req.body.departmentId;
    const roomId = req.body.roomId;
    // Check if the data exisit or not
    const siteCheck = await prisma.SiteTBL.findUnique({
      where: {
        siteid: siteId,
      },
    });
    const buildingCheck = await prisma.BuildingTBL.findUnique({
      where: {
        buildingid: buildingId,
      },
    });
    const officeCheck = await prisma.OfficeTBL.findUnique({
      where: {
        officeid: officeId,
      },
    });
    const departmentCheck = await prisma.DepartmentTBL.findUnique({
      where: {
        departmentid: departmentId,
      },
    });
    const roomCheck1 = await prisma.RoomTBL.findUnique({
      where: {
        roomid: roomId,
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
    //update user site data
    const updatedUser = await prisma.EmployeeTBL.update({
      where: {
        empid: req.userId,
      },
      data: {
        sitid: {
          connect: {
            siteid: siteId,
          },
        },
        bulidingref: {
          connect: {
            buildingid: buildingId,
          },
        },
        offid: {
          connect: {
            officeid: officeId,
          },
        },
        departmentref: {
          connect: {
            departmentid: departmentId,
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
        message: "User Site Updated Successfully",
        updatedUser: updatedUser,
      });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
    return err;
  }
};
