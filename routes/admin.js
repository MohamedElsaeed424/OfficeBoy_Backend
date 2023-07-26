const express = require("express");

const isAuth = require("../middleware/is-auth");
const adminController = require("../controllers/admin");
const { body } = require("express-validator");
const router = express.Router();

router.post("/add-item", isAuth, adminController.addItem);

module.exports = router;
