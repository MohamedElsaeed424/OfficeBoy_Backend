const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const fileHelper = require("../../util/file");
const { validationResult } = require("express-validator");
const siteGetter = require("../../util/siteGetter");
exports.addSiteData = async (req, res, next) => {
  try {
    const user = await prisma.UsersTBL.findUnique({
      where: {
        userid: req.userId,
      },
      include: {
        roleref: true,
      },
    });
    if (user.roleref.rolename == "Admin") {
      const site = req.body.site;
      const building = req.body.building;
      const office = req.body.office;
      const department = req.body.department;
      const roomName = req.body.roomName;
      const roomNum = req.body.roomNum;

      //---------------------------Validations--------------------------
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const error = new Error("Please Try again , Validation Failed");
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
      }
      // check if already exist
      const siteCheck = await prisma.SiteTBL.findUnique({
        where: {
          sitename: site,
        },
      });
      const buildingCheck = await prisma.BuildingTBL.findFirst({
        where: {
          buildingname: building,
          siteid: siteCheck.siteid,
        },
      });
      const officeCheck = await prisma.OfficeTBL.findFirst({
        where: {
          officeno: parseInt(office),
          buildingid: buildingCheck.buildingid,
        },
      });
      const departmentCheck = await prisma.DepartmentTBL.findFirst({
        where: {
          departmentname: department,
          buildingid: buildingCheck.buildingid,
        },
      });
      const roomCheck = await prisma.RoomTBL.findFirst({
        where: {
          roomno: parseInt(roomNum),
          roomname: roomName,
          officeid: officeCheck.officeid,
          departmentid: departmentCheck.departmentid,
        },
      });
      if (
        siteCheck &&
        buildingCheck &&
        officeCheck &&
        departmentCheck &&
        roomCheck
      ) {
        res.status(403).json({ message: "These Data  already exist" });
        const error = new Error("This These Data  already exist");
        error.statusCode = 403;
        error.data = errors.array();
        throw error;
      }
      let siteId;
      let buildingId;
      let officeId;
      let departmentId;
      let roomId;
      let createdSite;
      let createdBuilding;
      let createdOffice;
      let createdDepartment;
      let createdRoom;
      ///-----------------------------------------------------
      if (siteCheck) {
        siteId = siteCheck.siteid;
      } else {
        createdSite = await prisma.SiteTBL.create({
          data: {
            sitename: site,
          },
        });
        siteId = createdSite.siteid;
      }

      if (buildingCheck && buildingCheck.siteid === siteId) {
        buildingId = buildingCheck.buildingid;
      } else {
        createdBuilding = await prisma.BuildingTBL.create({
          data: {
            buildingname: building,
            siteref: {
              connect: {
                siteid: siteId,
              },
            },
          },
        });
        buildingId = createdBuilding.buildingid;
      }

      if (officeCheck && officeCheck.buildingid === buildingId) {
        officeId = officeCheck.officeid;
      } else {
        createdOffice = await prisma.OfficeTBL.create({
          data: {
            officeno: parseInt(office),
            bulidingref: {
              connect: {
                buildingid: buildingId,
              },
            },
          },
        });
        officeId = createdOffice.officeid;
      }

      if (departmentCheck && departmentCheck.buildingid === buildingId) {
        departmentId = departmentCheck.departmentid;
      } else {
        createdDepartment = await prisma.DepartmentTBL.create({
          data: {
            departmentname: department,
            bulidingref: {
              connect: {
                buildingid: buildingId,
              },
            },
          },
        });
        departmentId = createdDepartment.departmentid;
      }

      if (
        roomCheck &&
        roomCheck.departmentid === departmentId &&
        roomCheck.officeid === officeId
      ) {
        roomId = roomCheck.roomid;
      } else {
        createdRoom = await prisma.RoomTBL.create({
          data: {
            roomno: parseInt(roomNum),
            roomname: roomName,
            officeref: {
              connect: {
                officeid: officeId,
              },
            },
            roomdepref: {
              connect: {
                departmentid: departmentId,
              },
            },
          },
        });
        roomId = createdRoom.roomid;
      }
      //-------------------------------------------------------
      //  Get all values to send in json
      const siteEX = await prisma.SiteTBL.findUnique({
        where: {
          siteid: siteId,
        },
      });
      const buildingEX = await prisma.BuildingTBL.findUnique({
        where: {
          buildingid: buildingId,
        },
      });
      const officeEX = await prisma.OfficeTBL.findUnique({
        where: {
          officeid: officeId,
        },
      });
      const departmentEX = await prisma.DepartmentTBL.findUnique({
        where: {
          departmentid: departmentId,
        },
      });
      const roomEX = await prisma.RoomTBL.findUnique({
        where: {
          roomid: roomId,
        },
      });
      res
        .status(201)
        // connect with Front end...
        .json({
          message: "Site data Created Successfully",
          site: siteEX,
          building: buildingEX,
          office: officeEX,
          department: departmentEX,
          room: roomEX,
          creator: { userid: user.userid, name: user.firstname },
        });
    } else {
      res.status(403).json({
        message: "You Are not allowed to add this item , you are not Admin",
      });
      const error = new Error(
        "You Are not allowed to add this item , you are not Admin"
      );
      error.statusCode = 403;
      throw error;
    }
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getSiteData = async (req, res, next) => {
  try {
    const sites = await prisma.SiteTBL.findMany();
    if (sites.length === 0) {
      res
        .status(404)
        .json({ message: "Sorry, No Sites to be shown yet , Try add some" });
      const error = new Error("Sorry, No Sites to be shown yet , Try add some");
      error.statusCode = 404;
      throw error;
    }
    console.log(sites);
    res.status(200).json({ sites: sites });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getBuildingData = async (req, res, next) => {
  try {
    const siteId = req.body.siteId;
    const site = await prisma.SiteTBL.findUnique({
      where: {
        siteid: siteId,
      },
      include: {
        Building: true,
      },
    });
    if (!site) {
      res.status(404).json({ message: "This Site Dose't Exist" });
      const error = new Error("This Site Dose't Exist");
      error.statusCode = 404;
      throw error;
    }
    const buildings = await prisma.BuildingTBL.findMany({
      where: {
        siteid: siteId,
      },
    });
    if (buildings.length === 0) {
      res.status(404).json({
        message: "Sorry, No buildings to be shown yet , Try add some",
      });
      const error = new Error(
        "Sorry, No buildings to be shown yet , Try add some"
      );
      error.statusCode = 404;
      throw error;
    }
    console.log(buildings);
    res.status(200).json({ buildings: buildings });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getOfficeData = async (req, res, next) => {
  try {
    const siteId = req.body.siteId;
    const site = await siteGetter.getSite(siteId);
    if (!site) {
      res.status(404).json({ message: "This Site Dose't Exist" });
      const error = new Error("This Site Dose't Exist");
      error.statusCode = 404;
      throw error;
    }
    const siteBuildings = site.Building;
    let officesContainer = [];
    for (let i = 0; i < siteBuildings.length; i++) {
      const office = await prisma.OfficeTBL.findFirst({
        where: {
          buildingid: siteBuildings[i].buildingid,
        },
      });
      if (office) {
        officesContainer.push(office);
      }
    }
    console.log(officesContainer.length === 0);
    if (officesContainer.length === 0) {
      res.status(404).json({
        message: "Sorry, No offices to be shown yet , Try add some",
      });
      const error = new Error(
        "Sorry, No offices to be shown yet , Try add some"
      );
      error.statusCode = 404;
      throw error;
    }
    console.log(officesContainer);
    res.status(200).json({ offices: officesContainer });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getDepartmentData = async (req, res, next) => {
  try {
    const siteId = req.body.siteId;
    const site = await siteGetter.getSite(siteId);
    if (!site) {
      res.status(404).json({ message: "This Site Dose't Exist" });
      const error = new Error("This Site Dose't Exist");
      error.statusCode = 404;
      throw error;
    }
    const siteBuildings = site.Building;
    let departmentsContainer = [];
    for (let i = 0; i < siteBuildings.length; i++) {
      const department = await prisma.DepartmentTBL.findFirst({
        where: {
          buildingid: siteBuildings[i].buildingId,
        },
      });
      if (department) {
        departmentsContainer.push(department);
      }
    }

    if (departmentsContainer.length === 0) {
      res.status(404).json({
        message: "Sorry, No departments to be shown yet , Try add some",
      });
      const error = new Error(
        "Sorry, No departments to be shown yet , Try add some"
      );
      error.statusCode = 404;
      throw error;
    }
    console.log(departmentsContainer);
    res.status(200).json({ departments: departmentsContainer });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getRoomData = async (req, res, next) => {
  try {
    const siteId = req.body.siteId;
    const site = await siteGetter.getSite(siteId);
    if (!site) {
      res.status(404).json({ message: "This Site Dose't Exist" });
      const error = new Error("This Site Dose't Exist");
      error.statusCode = 404;
      throw error;
    }
    const siteBuildings = site.Building;
    let officesContainer = [];
    for (let i = 0; i < siteBuildings.length; i++) {
      const office = await prisma.OfficeTBL.findFirst({
        where: {
          buildingid: siteBuildings[i].buildingid,
        },
      });
      if (office) {
        officesContainer.push(office);
      }
    }
    let departmentsContainer = [];
    for (let i = 0; i < siteBuildings.length; i++) {
      const department = await prisma.DepartmentTBL.findFirst({
        where: {
          buildingid: siteBuildings[i].buildingId,
        },
      });
      if (department) {
        departmentsContainer.push(department);
      }
    }
    // console.log(officesContainer[0]);
    // console.log(departmentsContainer[0]);
    console.log();
    let roomsContainer = [];
    for (
      let i = 0;
      i < officesContainer.length || i < departmentsContainer.length;
      i++
    ) {
      console.log("Loop", i, officesContainer[i]);
      console.log("Loop", i, departmentsContainer[i]);
      let room;
      if (officesContainer[i] && departmentsContainer[i]) {
        room = await prisma.RoomTBL.findFirst({
          where: {
            officeid: officesContainer[i].officeid,
            departmentid: departmentsContainer[i].departmentid,
          },
        });
      } else if (!officesContainer[i] && departmentsContainer[i]) {
        room = await prisma.RoomTBL.findFirst({
          where: {
            departmentid: departmentsContainer[i].departmentid,
          },
        });
      } else if (!departmentsContainer[i] && officesContainer[i]) {
        room = await prisma.RoomTBL.findFirst({
          where: {
            officeid: officesContainer[i].officeid,
          },
        });
      }
      if (room) {
        roomsContainer.push(room);
      }
    }

    if (roomsContainer.length === 0) {
      res.status(404).json({
        message: "Sorry, No rooms to be shown yet , Try add some",
      });
      const error = new Error("Sorry, No rooms to be shown yet , Try add some");
      error.statusCode = 404;
      throw error;
    }
    console.log(roomsContainer);
    res.status(200).json({ rooms: roomsContainer });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
