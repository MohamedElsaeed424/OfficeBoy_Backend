const express = require("express");

const ordersController = require("../../controllers/employees/orders");
const checkRequestBody = require("../../middleware/bodyDataChecker");
const isAuth = require("../../middleware/is-auth");
const router = express.Router();

router.post("/create-order", isAuth, ordersController.createOrder);

router.get("/get-order", isAuth, ordersController.getOrder);

router.get("/get-orders-history", isAuth, ordersController.getOrdersHistory);

router.post("/reorder/:orderId", isAuth, ordersController.reOrder);

module.exports = router;
