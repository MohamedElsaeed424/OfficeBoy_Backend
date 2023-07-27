const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const fileHelper = require("../util/file");

exports.addItem = async (req, res, next) => {
  //----------------------------------Check for Image Exist-------
  // if (!req.file) {
  //   const error = new Error("No image Provided");
  //   error.statusCode = 422;
  //   throw error;
  // }
  const itemName = req.body.itemName;
  // const itemImag = req.file.path.replace("\\", "/");
  const itemImag = req.body.itemimagurl;
  const category = req.body.category;

  //-------------------Add item-----------------
  try {
    console.log(req.userId + " hello");
    const createdItem = await prisma.ItemsTBL.create({
      data: {
        itemname: itemName,
        itemimagurl: itemImag,
        categoryname: category,
        userid: req.userId,
      },
    });
    const user = prisma.UsersTBL.findUnique({
      where: {
        userid: req.userId,
      },
    });
    user.Items.push(createdItem);
    console.log(createdItem);
    res
      .status(201)
      // connect with Front end...
      .json({
        message: "Item Created Successfully",
        item: createdItem,
        creator: { userid: user.userid, name: user.firstname },
      });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
//-----------------------delete item-------------
exports.deleteItem = async (req, res, next) => {
  const itemId = req.params.itemId;
  try {
    const item = await prisma.ItemsTBL.findUnique({
      where: {
        itemid: itemId,
      },
    });
    if (!item) {
      const error = new Error("Sorry, No Item to be Deleted");
      error.statusCode = 404;
      throw error;
    }
    if (item.userid.toString() !== req.userId) {
      const error = new Error("You Are not allowed to Delete this item");
      error.statusCode = 403;
      throw error;
    }
    fileHelper.clearImage(item.itemimagurl);
    const deletedItem = await prisma.ItemsTBL.delete({
      where: {
        itemid: itemId,
      },
    });
    const user = await prisma.UsersTBL.findUnique({
      where: {
        userid: req.userid,
      },
    });
    user.Items.pop(itemId);
    console.log("Item deleted successfuly!");
    res
      .status(200)
      .json({ message: "Item deleted Successfuly", deletedItem: deletedItem });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
//-------------edit item-----------------
exports.updateItem = async (req, res, next) => {
  const itemId = req.params.itemId;
  const itemName = req.body.itemName;
  // const itemImag = req.file.path.replace("\\", "/");
  const itemImag = req.body.itemimagurl;
  const category = req.body.category;
  // if (req.file) {
  //   itemImag = req.file.path.replace("\\", "/");
  // }
  if (!itemImag) {
    const error = new Error("Missing an Image Here!");
    error.statusCode = 422;
    throw error;
  }
  try {
    const item = await prisma.ItemsTBL.findUnique({
      where: {
        itemid: itemId,
      },
    });
    if (!item) {
      const error = new Error("Sorry, No Item to be Updated");
      error.statusCode = 404;
      throw error;
    }
    if (item.userid.toString() !== req.userId) {
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
        categoryname: category,
        userid: req.userId,
      },
    });
    console.log(item.itemname + " updated Successfuly");
    res
      .status(200)
      .json({ message: "Item Updated Successfully", item: updatedItem });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
///----------------------------Read item / search for item--------------------
exports.getItem = async (req, res,next) => {
  const itemId = req.params.itemId;
  try{
    const item = await prisma.ItemsTBL.findUnique ({
      where: {
        itemid : itemId,
      }
    })
    if (!item) {
      const error = new Error("Sorry, No Item to be get");
      error.statusCode = 404;
      throw error;
    }
    console.log(item);
    res
      .status(200)
      .json({item: item });
  }catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
}