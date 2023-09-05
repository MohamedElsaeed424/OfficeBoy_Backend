const express = require("express");

const finishingItemsController = require("../../controllers/officeBoys/finishingItems");
const checkRequestBody = require("../../middleware/bodyDataChecker");
const isAuth = require("../../middleware/is-auth");
const router = express.Router();

router.get(
  "/get-finishingItems",
  isAuth,
  finishingItemsController.getFinishingItems
);

module.exports = router;
