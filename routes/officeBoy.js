const express = require("express");
const router = express.Router();
const officeBoyController = require("../controllers/officeBoy");
const isAuth = require("../middleware/is-auth");

// no otherization for these routes they are valid for all users------------------------->
router.get("/", officeBoyController.getIndex);

router.get("/items", officeBoyController.getItems);

router.get("/item/:itemId", officeBoyController.getItem);

router.get("/item", officeBoyController.getNamedItem);

router.get("/category-items", officeBoyController.getCategoryItems);
//<------------------------------------------------------------

module.exports = router;
