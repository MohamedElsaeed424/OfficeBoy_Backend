const { PrismaClient } = require("@prisma/client");
const { use } = require("passport");

const { validationResult } = require("express-validator");

const prisma = new PrismaClient();

exports.addRole = async (req, res, next) => {
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
      const roleName = req.body.roleName;
      const roleNameCheck = await prisma.RoleTBL.findUnique({
        where: {
          rolename: roleName,
        },
      });
      if (roleNameCheck) {
        res.status(403).json({ message: "This Role already exist" });
        const error = new Error("This Role already exist");
        error.statusCode = 403;
        error.data = errors.array();
        throw error;
      }
      const createdRole = await prisma.RoleTBL.create({
        data: {
          rolename: roleName,
        },
      });
      res
        .status(201)
        // connect with Front end...
        .json({
          message: "Role Created Successfully",
          Role: createdRole,
          creator: { userid: user.userid, name: user.firstname },
        });
    } else {
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

exports.getRoles = async (req, res, next) => {
  try {
    const roles = await prisma.RoleTBL.findMany();
    if (roles.length === 0) {
      res.status(404).json({ message: "Sorry, No roles to be shown yet" });
      const error = new Error("Sorry, No roles to be shown for this category");
      error.statusCode = 404;
      throw error;
    }
    console.log(roles);
    res.status(200).json({ roles: roles });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
