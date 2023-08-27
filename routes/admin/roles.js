const express = require("express");

const isAuth = require("../../middleware/is-auth");
const rolesController = require("../../controllers/admin/roles");
const router = express.Router();

router.post("/add-role", rolesController.addRole);

module.exports = router;
