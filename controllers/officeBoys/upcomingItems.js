const { PrismaClient } = require("@prisma/client");
const { use } = require("passport");

const { validationResult } = require("express-validator");

const prisma = new PrismaClient();

exports.getUpcomingItems = async (req, res, next) => {
  try {
    const user = await prisma.UsersTBL.findUnique({
      where: {
        userid: req.userId,
      },
      include: {
        roleref: true,
      },
    });
    if (user.roleref.rolename == "office Boy") {
      console.log(user);
      const upcomingData = await prisma.UpcomingTBL.findUnique({
        where: {
          officeboyid: user.userid,
        },
        include: {
          upcomingItems: true,
        },
      });
      console.log(upcomingData.upcomingItems);
      if (!upcomingData.upcomingItems) {
        res.status(404).json({ message: "No orders Ordered yet" });
        const error = new Error("No orders Ordered yet");
        error.statusCode = 404;
        throw error;
      } else {
        const upcomingAllItems = await prisma.UpcomingItemsTBL.findMany({
          include: {
            UpcomingItemsData: true,
            orderitemref: true,
          },
        });
        res
          .status(200)
          .json({ UpcomingItems: upcomingAllItems, requestedOfficeBoy: user });
      }
    } else {
      res.status(403).json({
        message:
          "You Are not autherized to get these data , you are not Office Boy",
      });

      const error = new Error(
        "You Are not autherized to get these data , you are not Office Boy"
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

exports.updataUpcomingItemStatus = async (req, res, next) => {
  try {
    const user = await prisma.UsersTBL.findUnique({
      where: {
        userid: req.userId,
      },
      include: {
        roleref: true,
      },
    });
    //---------------------------Validations--------------------------
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error("Please Try again , Validation Failed");
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }
    if (user.roleref.rolename == "office Boy") {
      const upcomingItemId = req.params.upcomingItemId;
      const statusId = req.body.statusId;
      const statusCheck = await prisma.StatusTBL.findUnique({
        where: {
          statusid: parseInt(statusId),
        },
      });
      if (!statusCheck) {
        res.status(403).json({ message: "This Status Dose't Exist" });
        const error = new Error("This Status Dose't Exist");
        error.statusCode = 403;
        error.data = errors.array();
        throw error;
      }
      const updatedUpcomingItem = await prisma.UpcomingItemsTBL.update({
        where: {
          upcomingitemid: parseInt(upcomingItemId),
        },
        data: {
          statusref: {
            connect: {
              statusid: parseInt(statusId),
            },
          },
        },
      });
      const updateOrderItem = await prisma.orderItemsTBL.update({
        where: {
          orderitemid: updatedUpcomingItem.orderitemid,
        },
        data: {
          statusref: {
            connect: {
              statusid: parseInt(statusId),
            },
          },
        },
      });
      //   console.log(updatedUpcomingItem.orderitemid);
      res
        .status(201)
        // connect with Front end...
        .json({
          message: "Status Updated Successfully",
          choosenStatus: statusId,
          updatedUpcomingItem: updatedUpcomingItem,
          updateOrderItem: updateOrderItem,
        });
    } else {
      res.status(403).json({
        message:
          "You Are not autherized to get these data , you are not Office Boy",
      });

      const error = new Error(
        "You Are not autherized to get these data , you are not Office Boy"
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
