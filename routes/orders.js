const express = require("express");

const ordersController = require("../controllers/orders");
const router = express.Router();

router.post("/order", ordersController.order); //new code

router.get("/orders", ordersController.orders);

module.exports = router;
