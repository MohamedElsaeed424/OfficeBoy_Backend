const express = require("express");

const isAuth = require("../middleware/is-auth");
const categoriesController = require("../controllers/categories");
const router = express.Router();

router.post("/add-category", isAuth, categoriesController.addCategory);

router.get("/categories", categoriesController.getCategories);

router.put(
  "/edit-category/:categoryId",
  isAuth,
  categoriesController.updateCategory
);

router.delete(
  "/delete-category/:categoryId",
  isAuth,
  categoriesController.deleteCategory
);

module.exports = router;
