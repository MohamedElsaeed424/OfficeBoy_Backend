const express = require("express");

const isAuth = require("../middleware/is-auth");
const adminController = require("../controllers/admin");
const router = express.Router();

router.post("/add-item", isAuth, adminController.addItem);

router.delete("item/:itemId", isAuth, adminController.deleteItem);

router.put("item/:itemId", isAuth, adminController.updateItem);

router.get("item/:itemId", isAuth, adminController.getItem);

module.exports = router;
