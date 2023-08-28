const express = require("express");

const isAuth = require("../../middleware/is-auth");
const rolesController = require("../../controllers/admin/roles");
const router = express.Router();

router.post("/add-role", isAuth, rolesController.addRole);

// used in signup
router.get("/get-roles", isAuth, rolesController.getRoles);

module.exports = router;
