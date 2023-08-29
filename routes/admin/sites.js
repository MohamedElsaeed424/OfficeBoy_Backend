const express = require("express");

const isAuth = require("../../middleware/is-auth");
const sitesController = require("../../controllers/admin/sites");
const { body } = require("express-validator");
const router = express.Router();

router.post(
  "/add-site-data",
  [
    body("site")
      .trim()
      .not()
      .isEmpty()
      .isLength({ min: 5 })
      .withMessage("Please enter valid site name , minmum 5 characters")
      .custom(async (value, { req }) => {
        var format = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
        var checkValue = false;
        if (format.test(value)) {
          checkValue = true;
        } else {
          checkValue = false;
        }
        console.log(checkValue);
        if (checkValue == true) {
          return Promise.reject(
            "site name should contains only upper and lower cases characters."
          );
        }
      }),
    body("building")
      .trim()
      .not()
      .isEmpty()
      .isLength({ min: 5 })
      .withMessage("Please enter valid building name , minmum 5 characters")
      .custom(async (value, { req }) => {
        var format = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
        var checkValue = false;
        if (format.test(value)) {
          checkValue = true;
        } else {
          checkValue = false;
        }
        console.log(checkValue);
        if (checkValue == true) {
          return Promise.reject(
            "building name should contains only upper and lower cases characters."
          );
        }
      }),
    body("office")
      .trim()
      .not()
      .isEmpty()
      .withMessage("office number cant be empty ,Please select office number")
      .isNumeric()
      .withMessage("office number must be number"),
    body("department")
      .trim()
      .not()
      .isEmpty()
      .isLength({ min: 5 })
      .withMessage("Please enter valid department name , minmum 5 characters")
      .custom(async (value, { req }) => {
        var format = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
        var checkValue = false;
        if (format.test(value)) {
          checkValue = true;
        } else {
          checkValue = false;
        }
        console.log(checkValue);
        if (checkValue == true) {
          return Promise.reject(
            "department name should contains only upper and lower cases characters."
          );
        }
      }),
    body("roomName")
      .trim()
      .not()
      .isEmpty()
      .isLength({ max: 5 })
      .withMessage("Please enter valid room name , maximum 10 characters")
      .custom(async (value, { req }) => {
        var format = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
        var checkValue = false;
        if (format.test(value)) {
          checkValue = true;
        } else {
          checkValue = false;
        }
        console.log(checkValue);
        if (checkValue == true) {
          return Promise.reject(
            "room name should contains only upper and lower cases characters."
          );
        }
      }),
    body("roomNum")
      .trim()
      .not()
      .isEmpty()
      .withMessage("room number cant be empty ,Please select room number")
      .isNumeric()
      .withMessage("room number must be number"),
  ],
  isAuth,
  sitesController.addSiteData
);

router.get("/site-data", isAuth, sitesController.getSiteData);

router.get("/building-data", isAuth, sitesController.getBuildingData);

router.get("/office-data", isAuth, sitesController.getOfficeData);

router.get("/department-data", isAuth, sitesController.getDepartmentData);

router.get("/room-data", isAuth, sitesController.getRoomData);

module.exports = router;
