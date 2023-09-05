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
      if (upcomingData.upcomingItems.length === 0) {
        res.status(404).json({ message: "No orders Ordered yet" });
        const error = new Error("No orders Ordered yet");
        error.statusCode = 404;
        throw error;
      } else {
        const upcomingAllItems = await prisma.UpcomingItemsTBL.findMany({
          where: {
            upcomingid: upcomingData.upcomingid,
          },
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
      const upcomingItemCheck = await prisma.UpcomingItemsTBL.findUnique({
        where: {
          upcomingitemid: parseInt(upcomingItemId),
        },
      });
      if (!upcomingItemCheck) {
        res.status(403).json({ message: "This Item Dose't Exist" });
        const error = new Error("This Item Dose't Exist");
        error.statusCode = 403;
        error.data = errors.array();
        throw error;
      }
      let updatedUpcomingItem;
      let createdFinishingItem;
      if (statusId === 5) {
        // finished
        updatedUpcomingItem = await prisma.UpcomingItemsTBL.findUnique({
          where: {
            upcomingitemid: parseInt(upcomingItemId),
          },
          include: {
            UpcomingItemsData: true,
          },
        });
        // console.log(updatedUpcomingItem.UpcomingItemsData);
        const alldeletedUpcomingItemData =
          updatedUpcomingItem.UpcomingItemsData;
        console.log(alldeletedUpcomingItemData);
        for (let i = 0; i < updatedUpcomingItem.UpcomingItemsData.length; i++) {
          await prisma.UpcomingItemsDataTBL.delete({
            where: {
              upcomingItemsDataid:
                updatedUpcomingItem.UpcomingItemsData[i].upcomingItemsDataid,
            },
          });
        }

        await prisma.UpcomingItemsTBL.delete({
          where: {
            upcomingitemid: updatedUpcomingItem.upcomingitemid,
          },
        });

        console.log(user.userid);
        const createdFinishing = await prisma.FinishingTBL.findUnique({
          where: {
            officeboyid: user.userid,
          },
        });
        console.log(createdFinishing);
        createdFinishingItem = await prisma.FinishingItemsTBL.create({
          data: {
            empname: updatedUpcomingItem.empname,
            empoffice: updatedUpcomingItem.empoffice,
            emproomnum: updatedUpcomingItem.emproomnum,
            emproomname: updatedUpcomingItem.emproomname,
            finishingref: {
              connect: {
                finishingid: createdFinishing.finishingid,
              },
            },
          },
        });
        for (let i = 0; i < alldeletedUpcomingItemData.length; i++) {
          const FinishedItemData = await prisma.FinishingItemsDataTBL.create({
            data: {
              itemname: alldeletedUpcomingItemData[i].itemname,
              itemquantity: alldeletedUpcomingItemData[i].itemquantity,
              itemsize: alldeletedUpcomingItemData[i].itemsize,
              FinishingItemsref: {
                connect: {
                  finishingitemid: createdFinishingItem.finishingitemid,
                },
              },
            },
          });
        }
      } else {
        updatedUpcomingItem = await prisma.UpcomingItemsTBL.update({
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
      }

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
      console.log(createdFinishingItem);
      res.status(201).json({
        message: "Status Updated Successfully",
        choosenStatus: statusId,
        updatedUpcomingItem: updatedUpcomingItem,
        updateOrderItem: updateOrderItem,
        finishingItems: createdFinishingItem,
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
