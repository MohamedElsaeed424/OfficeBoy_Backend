const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { validationResult } = require("express-validator");

exports.addCategory = async (req, res, next) => {
  const user = await prisma.UsersTBL.findUnique({
    where: {
      userid: req.userId,
    },
    include: {
      roleref: true,
    },
  });
  if (user.roleref.rolename == "Admin") {
    try {
      const category = req.body.category;
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
          categoryname: category,
        },
      });

      if (categoryCheck) {
        res.status(403).json({ message: "Category already Exist" });
        const error = new Error("Category already Exist");
        error.statusCode = 403;
        error.data = errors.array();
        throw error;
      } else {
        const createdDCategory = await prisma.CategoriesTbl.create({
          data: {
            categoryname: category,
          },
        });
        res.status(201).json({
          message: "Category Created Successfully",
          category: createdDCategory,
          Creator: user.userid,
        });
      }
    } catch (err) {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    }
  } else {
    const error = new Error(
      "You Are not allowed to add this Category , you are not Admin"
    );
    error.statusCode = 403;
    throw error;
  }
};

// Still not working
exports.deleteCategory = async (req, res, next) => {
  const user = await prisma.UsersTBL.findUnique({
    where: {
      userid: req.userId,
    },
    include: {
      roleref: true,
    },
  });
  if (user.roleref.rolename == "Admin") {
    try {
      const categoryId = req.params.categoryId;
      const category = await prisma.CategoriesTbl.findUnique({
        where: {
          categoryid: parseInt(categoryId),
        },
      });
      if (!category) {
        res
          .status(404)
          .json({ message: "Category Doesnot  Exist to be deleted" });
        const error = new Error("Sorry, Category Doesnot Exist to be deleted");
        error.statusCode = 404;
        throw error;
      }
      //   if (item.userid !== req.userId) {
      //     const error = new Error("You Are not allowed to Delete this item");
      //     error.statusCode = 403;
      //     throw error;
      //   }
      // fileHelper.clearImage(item.itemimagurl);
      const deletedCategory = await prisma.CategoriesTbl.delete({
        where: {
          categoryid: parseInt(categoryId),
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
        deletedCategory: deletedCategory,
      });
    } catch (err) {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    }
  } else {
    const error = new Error(
      "You Are not allowed to delete this category , you are not Admin"
    );
    error.statusCode = 403;
    throw error;
  }
};

exports.updateCategory = async (req, res, next) => {
  const user = await prisma.UsersTBL.findUnique({
    where: {
      userid: req.userId,
    },
    include: {
      roleref: true,
    },
  });
  if (user.roleref.rolename == "Admin") {
    const categoryId = req.params.categoryId;
    const categoryName = req.body.categoryName;
    try {
      //---------------------------Validations--------------------------
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const error = new Error("Please Try again , Validation Failed");
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
      }

      const category = await prisma.CategoriesTbl.findUnique({
        where: {
          categoryid: parseInt(categoryId),
        },
      });
      if (!category) {
        res
          .status(404)
          .json({ message: "Category Doesnot  Exist to be Updated" });
        const error = new Error("Sorry, Category Doesnot Exist to be updated");
        error.statusCode = 404;
        throw error;
      }
      const updatedCategory = await prisma.CategoriesTbl.update({
        where: {
          categoryid: category.categoryid,
        },
        data: {
          categoryname: categoryName,
        },
      });
      console.log(category.categoryname + " updated Successfuly");
      res.status(200).json({
        message: "Category Updated Successfully",
        Category: updatedCategory,
      });
    } catch (err) {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    }
  } else {
    const error = new Error(
      "You Are not allowed to update this category , you are not Admin"
    );
    error.statusCode = 403;
    throw error;
  }
};

exports.getCategories = async (req, res, next) => {
  try {
    const categories = await prisma.CategoriesTbl.findMany();
    if (categories.length === 0) {
      res.status(404).json({ message: "Sorry, No categories to be shown yet" });
      const error = new Error(
        "Sorry, No categories to be shown for this category"
      );
      error.statusCode = 404;
      throw error;
    }
    console.log(categories);
    res.status(200).json({ categories: categories });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
