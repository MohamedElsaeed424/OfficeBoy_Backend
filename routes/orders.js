const express = require("express");

const ordersController = require("../controllers/orders");
const isAuth = require("../middleware/is-auth");
const router = express.Router();

router.post("/order", ordersController.order); //new code

router.get("/orders/:orderId", isAuth, ordersController.getOrders);

module.exports = router;
