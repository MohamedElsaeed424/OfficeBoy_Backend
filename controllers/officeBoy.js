const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

exports.getIndex = async (req, res, next) => {
  try {
    const items = await prisma.ItemsTBL.findMany();
    if (items.length === 0) {
      res.status(404).json({ message: "Sorry, No Items to be shown yet" });
      const error = new Error("Sorry, No Items to be shown for this category");
      error.statusCode = 404;
      throw error;
    }
    console.log(items);
    res.status(200).json({ items: items });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
// getIndex and getItems are the same dont think alot about this :/
exports.getItems = async (req, res, next) => {
  try {
    const items = await prisma.ItemsTBL.findMany();
    if (items.length === 0) {
      res.status(404).json({ message: "Sorry, No Items to be shown yet" });
      const error = new Error("Sorry, No Items to be shown for this category");
      error.statusCode = 404;
      throw error;
    }
    console.log(items);
    res.status(200).json({ items: items });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getNamedItem = async (req, res, next) => {
  const itemName = req.body.itemname;
  try {
    const item = await prisma.ItemsTBL.findUnique({
      where: {
        itemname: itemName,
      },
    });
    if (!item) {
      res.status(404).json({ message: "Sorry, No Item to be shown" });
      const error = new Error("Sorry, No Item to be shown");
      error.statusCode = 404;
      throw error;
    }
    console.log(item);
    res.status(200).json({ namedItem: item });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getCategoryItems = async (req, res, next) => {
  const itemCategory = req.body.category;
  const category = itemCategory.toUpperCase(); // to genralize category names
  try {
    const itemsForCategory = await prisma.ItemsTBL.findMany({
      where: {
        categoryname: category,
      },
    });
    if (itemsForCategory.length === 0) {
      res.status(404).json({ message: "Sorry, No Items to be shown" });
      const error = new Error("Sorry, No Items to be shown for this category");
      error.statusCode = 404;
      throw error;
    }
    console.log(itemsForCategory);
    res.status(200).json({ items: itemsForCategory });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
