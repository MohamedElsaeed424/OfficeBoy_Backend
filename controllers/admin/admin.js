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

exports.addItem = async (req, res, next) => {
  try {
    const user = await prisma.UsersTBL.findUnique({
      where: {
        userid: req.userId,
      },
      include: {
        roleref: true,
      },
    });
    if (user.roleref.rolename == "Admin") {
      //----------------------------------Check for Image Exist-------
      // if (!req.file) {
      //   const error = new Error("No image Provided");
      //   error.statusCode = 422;
      //   throw error;
      // }
      const itemName = req.body.itemname;
      // const itemImag = req.file.path.replace("\\", "/");
      const itemImag = req.body.itemimagurl;
      // const itemCategory = req.body.categoryname;
      // console.log("itemCategory:", itemCategory);
      // const category = itemCategory.toUpperCase();
      const category = req.body.category;
      const description = req.body.description;
      //const category = itemCategory.toUpperCase(); // to generalize category names

      //-------------------Add item-----------------
      //---------------------------Validations--------------------------
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const error = new Error("Please Try again , Validation Failed");
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
      }
      const categoryCheck = await prisma.CategoriesTbl.findUnique({
        where: {
          categoryid: parseInt(category),
        },
      });
      const itemNameCheck = await prisma.ItemsTBL.findUnique({
        where: {
          itemname: itemName,
        },
      });
      if (itemNameCheck) {
        res.status(403).json({ message: "item name already exist" });
        const error = new Error("item name already exist");
        error.statusCode = 403;
        error.data = errors.array();
        throw error;
      }
      if (!categoryCheck) {
        res.status(403).json({ message: "Category dosen't exist" });
        const error = new Error("Category dosen't exist");
        error.statusCode = 403;
        error.data = errors.array();
        throw error;
      }
      const createdItem = await prisma.itemsTBL.create({
        data: {
          itemname: itemName,
          itemimagurl: itemImag,
          itemidescription: description,
          creator: {
            connect: {
              userid: req.userId,
            },
          },
          catid: {
            connect: {
              categoryid: parseInt(category),
            },
          },
          // carttid: null,
        },
      });
      const user = await prisma.UsersTBL.findUnique({
        where: {
          userid: req.userId,
        },
      });
      // user.Items.push(createdItem);
      console.log(createdItem);
      res
        .status(201)
        // connect with Front end...
        .json({
          message: "Item Created Successfully",
          item: createdItem,
          creator: { userid: user.userid, name: user.firstname },
        });
    } else {
      res.status(403).json({
        message: "You Are not allowed to add this item , you are not Admin",
      });
      const error = new Error(
        "You Are not allowed to add this item , you are not Admin"
      );
      error.statusCode = 403;
      throw error;
    }
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
//-----------------------delete item-------------
// category deleted
exports.deleteItem = async (req, res, next) => {
  try {
    const user = await prisma.UsersTBL.findUnique({
      where: {
        userid: req.userId,
      },
      include: {
        roleref: true,
      },
    });
    if (user.roleref.rolename == "Admin") {
      const itemId = req.params.itemId;
      console.log(itemId);
      console.log(parseInt(itemId));
      const item = await prisma.ItemsTBL.findUnique({
        where: {
          itemid: parseInt(itemId),
        },
      });
      if (!item) {
        const error = new Error("No Item to be Deleted");
        error.statusCode = 404;
        throw error;
      }
      if (item.userid !== req.userId) {
        const error = new Error("You Are not allowed to Delete this item");
        error.statusCode = 403;
        throw error;
      }
      // fileHelper.clearImage(item.itemimagurl);

      // check if the item used in another place
      const itemCheckInCartItems = await prisma.CartItemsTBL.findFirst({
        where: {
          itemids: {
            itemid: parseInt(itemId),
          },
        },
      });

      if (itemCheckInCartItems) {
        res.status(403).json({
          message:
            "This item exsists in one of employees cart , you can not delete it  ",
        });
        const error = new Error(
          "This item exsists in one of employees cart , you can not delete it"
        );
        error.statusCode = 403;
        throw error;
      }

      const deletedItem = await prisma.ItemsTBL.delete({
        where: {
          itemid: parseInt(itemId),
        },
      });
      const user = await prisma.UsersTBL.findUnique({
        where: {
          userid: req.userId,
        },
      });
      // user.Items.pop(itemId);
      console.log("Item deleted successfuly!");
      res.status(200).json({
        message: "Item deleted Successfuly",
        deletedItem: deletedItem,
      });
    } else {
      res.status(403).json({
        message: "You Are not allowed to add this item , you are not Admin",
      });
      const error = new Error(
        "You Are not allowed to add this item , you are not Admin"
      );
      error.statusCode = 403;
      throw error;
    }
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
//-------------edit item-----------------
exports.updateItem = async (req, res, next) => {
  try {
    const user = await prisma.UsersTBL.findUnique({
      where: {
        userid: req.userId,
      },
      include: {
        roleref: true,
      },
    });
    if (user.roleref.rolename == "Admin") {
      const itemId = req.params.itemId;
      const itemName = req.body.itemName;
      // const itemImag = req.file.path.replace("\\", "/");
      const itemImag = req.body.itemimagurl;
      // const itemCategory = req.body.category;
      // const category = itemCategory.toUpperCase(); // to genralize category names
      const category = req.body.category;
      const description = req.body.description;
      // if (req.file) {
      //   itemImag = req.file.path.replace("\\", "/");
      // }
      if (!itemImag) {
        const error = new Error("Missing an Image Here!");
        error.statusCode = 422;
        throw error;
      }

      //---------------------------Validations--------------------------
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const error = new Error("Please Try again , Validation Failed");
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
      }
      const item = await prisma.ItemsTBL.findUnique({
        where: {
          itemid: parseInt(itemId),
        },
      });
      if (!item) {
        const error = new Error("Sorry, No Item to be Updated");
        error.statusCode = 404;
        throw error;
      }
      if (item.userid !== req.userId) {
        const error = new Error("You Are not allowed to Update this item");
        error.statusCode = 403;
        throw error;
      }
      if (itemImag != item.itemimagurl) {
        fileHelper.clearImage(item.itemimagurl);
      }
      const updatedItem = await prisma.ItemsTBL.update({
        where: {
          itemid: item.itemid,
        },
        data: {
          itemname: itemName,
          itemimagurl: itemImag,
          itemidescription: description,
          creator: {
            connect: {
              userid: req.userId,
            },
          },
          catid: {
            connect: {
              categoryid: parseInt(category),
            },
          },
        },
      });
      console.log(item.itemname + " updated Successfuly");
      res
        .status(200)
        .json({ message: "Item Updated Successfully", item: updatedItem });
    } else {
      res.status(403).json({
        message: "You Are not allowed to add this item , you are not Admin",
      });

      const error = new Error(
        "You Are not allowed to add this item , you are not Admin"
      );
      error.statusCode = 403;
      throw error;
    }
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

///----------------------------Read item / search for item--------------------
exports.getItem = async (req, res, next) => {
  try {
    const user = await prisma.UsersTBL.findUnique({
      where: {
        userid: req.userId,
      },
      include: {
        roleref: true,
      },
    });
    if (user.roleref.rolename == "Admin") {
      const itemId = req.params.itemId;
      const item = await prisma.ItemsTBL.findUnique({
        where: {
          itemid: parseInt(itemId),
        },
      });
      if (!item) {
        const error = new Error("Sorry, No Item to be shown");
        error.statusCode = 404;
        throw error;
      }
      console.log(item);
      res.status(200).json({ item: item });
    } else {
      res.status(403).json({
        message: "You Are not allowed to add this item , you are not Admin",
      });
      const error = new Error(
        "You Are not allowed to add this item , you are not Admin"
      );
      error.statusCode = 403;
      throw error;
    }
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
