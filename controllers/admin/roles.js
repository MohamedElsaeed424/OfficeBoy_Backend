const { PrismaClient } = require("@prisma/client");
const { use } = require("passport");

const { validationResult } = require("express-validator");

const prisma = new PrismaClient();

exports.addRole = async (req, res, next) => {
  const user = await prisma.UsersTBL.findUnique({
    where: {
      userid: req.userId,
    },
  });
  if (user.role == "Admin") {
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
    const createdRole = await prisma.RoleTBL.creat({
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
  const roleName = req.body.roleName;
};
