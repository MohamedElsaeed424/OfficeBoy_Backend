const express = require("express");

const isAuth = require("../../middleware/is-auth");
const sitesController = require("../../controllers/admin/sites");
const router = express.Router();

router.post("/add-site-data", isAuth, sitesController.addSiteData);

router.get("/site-data", isAuth, sitesController.getSiteData);

router.get("/building-data", isAuth, sitesController.getBuildingData);

router.get("/office-data", isAuth, sitesController.getOfficeData);

router.get("/department-data", isAuth, sitesController.getDepartmentData);

router.get("/room-data", isAuth, sitesController.getRoomData);

module.exports = router;
