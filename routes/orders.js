const express = require("express");

const ordersController = require("../controllers/orders");
const isAuth = require("../middleware/is-auth");
const router = express.Router();

router.post("/create-order", isAuth, ordersController.createOrder);

// router.delete("/delete-order/:orderId", isAuth, ordersController.deleteOrder);

router.get("/get-order/:orderId", isAuth, ordersController.getOrder);

router.get("/get-orders", isAuth, ordersController.getOrders);

module.exports = router;
