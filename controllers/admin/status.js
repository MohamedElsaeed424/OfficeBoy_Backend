const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { validationResult } = require("express-validator");

exports.addStatus = async (req, res, next) => {
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
      const statusName = req.body.statusName;
      //---------------------------Validations--------------------------
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const error = new Error("Please Try again , Validation Failed");
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
      }
      const statusNameCheck = await prisma.StatusTBL.findUnique({
        where: {
          status: statusName,
        },
      });
      if (statusNameCheck) {
        res.status(403).json({ message: "This Status already exist" });
        const error = new Error("This Status already exist");
        error.statusCode = 403;
        error.data = errors.array();
        throw error;
      }
      const createdStatus = await prisma.StatusTBL.create({
        data: {
          status: statusName,
        },
      });
      res
        .status(201)
        // connect with Front end...
        .json({
          message: "Status Created Successfully",
          Status: createdStatus,
          creator: { userid: user.userid, name: user.firstname },
        });
    } else {
      res.status(403).json({
        message: "You Are not allowed to add this status, you are not Admin",
      });
      const error = new Error(
        "You Are not allowed to add this status , you are not Admin"
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

exports.getAllStatus = async (req, res, next) => {
  try {
    const status = await prisma.StatusTBL.findMany();
    if (status.length === 0) {
      res.status(404).json({ message: "Sorry, No status to be shown yet" });
      const error = new Error("Sorry, No status to be shown yet");
      error.statusCode = 404;
      throw error;
    }
    console.log(status);
    res.status(200).json({ status: status });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
