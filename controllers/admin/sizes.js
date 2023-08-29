const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { validationResult } = require("express-validator");

exports.addSize = async (req, res, next) => {
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
      const sizeName = req.body.sizeName;
      //---------------------------Validations--------------------------
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const error = new Error("Please Try again , Validation Failed");
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
      }
      const sizeNameCheck = await prisma.SizeTBL.findUnique({
        where: {
          sizename: sizeName,
        },
      });
      if (sizeNameCheck) {
        res.status(403).json({ message: "This Size already exist" });
        const error = new Error("This Size already exist");
        error.statusCode = 403;
        error.data = errors.array();
        throw error;
      }
      const createdSize = await prisma.SizeTBL.create({
        data: {
          sizename: sizeName,
        },
      });
      res
        .status(201)
        // connect with Front end...
        .json({
          message: "Size Created Successfully",
          Size: createdSize,
          creator: { userid: user.userid, name: user.firstname },
        });
    } else {
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

exports.getSizes = async (req, res, next) => {
  try {
    const sizes = await prisma.SizeTBL.findMany();
    if (sizes.length === 0) {
      res.status(404).json({ message: "Sorry, No sizes to be shown yet" });
      const error = new Error("Sorry, No sizes to be shown yet");
      error.statusCode = 404;
      throw error;
    }
    console.log(sizes);
    res.status(200).json({ sizes: sizes });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
