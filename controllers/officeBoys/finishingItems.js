const { PrismaClient } = require("@prisma/client");
const { use } = require("passport");

const { validationResult } = require("express-validator");

const prisma = new PrismaClient();

exports.getFinishingItems = async (req, res, next) => {
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
      const finishingData = await prisma.FinishingTBL.findUnique({
        where: {
          officeboyid: user.userid,
        },
        include: {
          FinishingItems: true,
        },
      });
      // console.log(finishingData.FinishingItems);
      if (finishingData.FinishingItems.length === 0) {
        res.status(404).json({ message: "No orders Finished yet" });
        const error = new Error("No orders Finished yet");
        error.statusCode = 404;
        throw error;
      } else {
        let finishedItemsDataContainer = [];
        for (let i = 0; i < finishingData.FinishingItems.length; i++) {
          const finishingItem = await prisma.FinishingItemsTBL.findUnique({
            where: {
              finishingitemid: finishingData.FinishingItems[i].finishingitemid,
            },
            include: {
              FinishingItemsData: true,
            },
          });
          finishedItemsDataContainer.push(finishingItem);
        }

        res.status(200).json({ FinishingItems: finishedItemsDataContainer });
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
