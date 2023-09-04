const express = require("express");

const upcomingItemsController = require("../../controllers/officeBoys/upcomingItems");
const checkRequestBody = require("../../middleware/bodyDataChecker");
const isAuth = require("../../middleware/is-auth");
const router = express.Router();

router.get(
  "/get-upcomingItems",
  isAuth,
  upcomingItemsController.getUpcomingItems
);

router.put(
  "/upcommingItem-status/:upcomingItemId",
  isAuth,
  checkRequestBody,
  upcomingItemsController.updataUpcomingItemStatus
);

module.exports = router;
