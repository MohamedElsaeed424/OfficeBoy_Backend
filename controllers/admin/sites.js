const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const fileHelper = require("../../util/file");
const { validationResult } = require("express-validator");
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
      const buildingCheck = await prisma.BuildingTBL.findUnique({
        where: {
          buildingname: building,
        },
      });
      const officeCheck = await prisma.OfficeTBL.findUnique({
        where: {
          officeno: parseInt(office),
        },
      });
      const departmentCheck = await prisma.DepartmentTBL.findUnique({
        where: {
          departmentname: department,
        },
      });
      const roomCheck1 = await prisma.RoomTBL.findUnique({
        where: {
          roomno: parseInt(roomNum),
        },
      });
      const roomCheck2 = await prisma.RoomTBL.findUnique({
        where: {
          roomname: roomName,
        },
      });
      if (siteCheck) {
        res.status(403).json({ message: "This Site already exist" });
        const error = new Error("This Site already exist");
        error.statusCode = 403;
        error.data = errors.array();
        throw error;
      }
      // if (buildingCheck) {
      //   res.status(403).json({ message: "This Building already exist" });
      //   const error = new Error("This Building already exist");
      //   error.statusCode = 403;
      //   error.data = errors.array();
      //   throw error;
      // }
      // if (officeCheck) {
      //   res.status(403).json({ message: "This Office already exist" });
      //   const error = new Error("This Office already exist");
      //   error.statusCode = 403;
      //   error.data = errors.array();
      //   throw error;
      // }
      // if (departmentCheck) {
      //   res.status(403).json({ message: "This Department already exist" });
      //   const error = new Error("This Department already exist");
      //   error.statusCode = 403;
      //   error.data = errors.array();
      //   throw error;
      // }
      // if (roomCheck1) {
      //   res.status(403).json({ message: "This Room Number  already exist" });
      //   const error = new Error("This Room Number  already exist");
      //   error.statusCode = 403;
      //   error.data = errors.array();
      //   throw error;
      // }
      // if (roomCheck2) {
      //   res.status(403).json({ message: "This Room Name  already exist" });
      //   const error = new Error("This Room Name  already exist");
      //   error.statusCode = 403;
      //   error.data = errors.array();
      //   throw error;
      // }
      if (
        buildingCheck &&
        officeCheck &&
        departmentCheck &&
        roomCheck1 &&
        roomCheck2
      ) {
        res.status(403).json({ message: "These Data  already exist" });
        const error = new Error("This These Data  already exist");
        error.statusCode = 403;
        error.data = errors.array();
        throw error;
      }
      // add
      const createdSite = await prisma.SiteTBL.create({
        data: {
          sitename: site,
        },
      });
      const createBuilding = await prisma.BuildingTBL.create({
        data: {
          buildingname: building,
          siteref: {
            connect: {
              siteid: createdSite.siteid,
            },
          },
        },
      });
      const createdOffice = await prisma.OfficeTBL.create({
        data: {
          officeno: parseInt(office),
          bulidingref: {
            connect: {
              buildingid: createBuilding.buildingid,
            },
          },
        },
      });
      const cratedDepartment = await prisma.DepartmentTBL.create({
        data: {
          departmentname: department,
          bulidingref: {
            connect: {
              buildingid: createBuilding.buildingid,
            },
          },
        },
      });
      const createdRoom = await prisma.RoomTBL.create({
        data: {
          roomno: parseInt(roomNum),
          roomname: roomName,
          officeref: {
            connect: {
              officeid: createdOffice.officeid,
            },
          },
          roomdepref: {
            connect: {
              departmentid: cratedDepartment.departmentid,
            },
          },
        },
      });
      res
        .status(201)
        // connect with Front end...
        .json({
          message: "Site data Created Successfully",
          site: createdSite,
          building: createBuilding,
          office: createdOffice,
          department: cratedDepartment,
          room: createdRoom,
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
  // const user = await prisma.UsersTBL.findUnique({
  //   where: {
  //     userid: req.userId,
  //   },
  //   include: {
  //     roleref: true,
  //   },
  // });
  // if (user.roleref.rolename == "Admin") {
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
  // } else {
  //   const error = new Error(
  //     "You Are not allowed to add this item , you are not Admin"
  //   );
  //   error.statusCode = 403;
  //   throw error;
  // }
};

exports.getBuildingData = async (req, res, next) => {
  // const user = await prisma.UsersTBL.findUnique({
  //   where: {
  //     userid: req.userId,
  //   },
  //   include: {
  //     roleref: true,
  //   },
  // });
  // if (user.roleref.rolename == "Admin") {
  try {
    const buildings = await prisma.BuildingTBL.findMany();
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
  // } else {
  //   res.status(403).json({
  //     message: "You Are not allowed to add this item , you are not Admin",
  //   });
  //   const error = new Error(
  //     "You Are not allowed to add this item , you are not Admin"
  //   );
  //   error.statusCode = 403;
  //   throw error;
  // }
};

exports.getOfficeData = async (req, res, next) => {
  // const user = await prisma.UsersTBL.findUnique({
  //   where: {
  //     userid: req.userId,
  //   },
  //   include: {
  //     roleref: true,
  //   },
  // });
  // if (user.roleref.rolename == "Admin") {
  try {
    const offices = await prisma.OfficeTBL.findMany();
    if (offices.length === 0) {
      res.status(404).json({
        message: "Sorry, No offices to be shown yet , Try add some",
      });
      const error = new Error(
        "Sorry, No offices to be shown yet , Try add some"
      );
      error.statusCode = 404;
      throw error;
    }
    console.log(offices);
    res.status(200).json({ office: offices });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
  // } else {
  //   res.status(403).json({
  //     message: "You Are not allowed to add this item , you are not Admin",
  //   });
  //   const error = new Error(
  //     "You Are not allowed to add this item , you are not Admin"
  //   );
  //   error.statusCode = 403;
  //   throw error;
  // }
};

exports.getDepartmentData = async (req, res, next) => {
  // const user = await prisma.UsersTBL.findUnique({
  //   where: {
  //     userid: req.userId,
  //   },
  //   include: {
  //     roleref: true,
  //   },
  // });
  // if (user.roleref.rolename == "Admin") {
  try {
    const departments = await prisma.DepartmentTBL.findMany();
    if (departments.length === 0) {
      res.status(404).json({
        message: "Sorry, No departments to be shown yet , Try add some",
      });
      const error = new Error(
        "Sorry, No departments to be shown yet , Try add some"
      );
      error.statusCode = 404;
      throw error;
    }
    console.log(departments);
    res.status(200).json({ departments: departments });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
  // } else {
  //   const error = new Error(
  //     "You Are not allowed to add this item , you are not Admin"
  //   );
  //   error.statusCode = 403;
  //   throw error;
  // }
};

exports.getRoomData = async (req, res, next) => {
  // const user = await prisma.UsersTBL.findUnique({
  //   where: {
  //     userid: req.userId,
  //   },
  //   include: {
  //     roleref: true,
  //   },
  // });
  // if (user.roleref.rolename == "Admin") {
  try {
    const rooms = await prisma.RoomTBL.findMany();
    if (rooms.length === 0) {
      res.status(404).json({
        message: "Sorry, No rooms to be shown yet , Try add some",
      });
      const error = new Error("Sorry, No rooms to be shown yet , Try add some");
      error.statusCode = 404;
      throw error;
    }
    console.log(rooms);
    res.status(200).json({ rooms: rooms });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
  // } else {
  //   const error = new Error(
  //     "You Are not allowed to add this item , you are not Admin"
  //   );
  //   error.statusCode = 403;
  //   throw error;
  // }
};
