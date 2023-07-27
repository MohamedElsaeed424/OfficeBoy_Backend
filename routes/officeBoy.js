const express = require("express");
const router = express.Router();
const officeBoyController = require("../controllers/officeBoy");
const adminController = require("../controllers/admin");
const isAuth = require("../middleware/is-auth");

// no otherization for these routes they are valid for all users------------------------->
router.get("/", officeBoyController.getIndex);

router.get("/items", officeBoyController.getItems);

router.get("/item/:itemId", adminController.getItem);

router.get("/item", officeBoyController.getNamedItem);

router.get("/category-items", officeBoyController.getCategoryItems);
//<------------------------------------------------------------

module.exports = router;
