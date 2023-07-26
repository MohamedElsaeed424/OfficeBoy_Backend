const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.addItem = async (req, res, next) => {
  const itemName = req.body.itemName;
  const itemImag = req.file;
  const category = req.body.category;

  try {
    const createdItem = await prisma.ItemsTBL.create({
      data: {
        itemname: itemName,
      },
    });
    console.log(createdItem);
    res
      .status(201)
      // connect with Front end...
      .json({
        message: "Item Created Successfully",
        itemid: createdItem.itemid,
      });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
