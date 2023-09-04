const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { validationResult } = require("express-validator");

exports.addDomain = async (req, res, next) => {
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
      const domainName = req.body.domainName;
      //---------------------------Validations--------------------------
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const error = new Error("Please Try again , Validation Failed");
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
      }
      const domainNameCheck = await prisma.DomainsTBL.findUnique({
        where: {
          domain: domainName,
        },
      });
      if (domainNameCheck) {
        res.status(403).json({ message: "This Domain already exist" });
        const error = new Error("This Size already exist");
        error.statusCode = 403;
        error.data = errors.array();
        throw error;
      }
      const createdDomain = await prisma.DomainsTBL.create({
        data: {
          domain: domainName,
        },
      });
      res
        .status(201)
        // connect with Front end...
        .json({
          message: "Domain Created Successfully",
          Domain: createdDomain,
          creator: { userid: user.userid, name: user.firstname },
        });
    } else {
      res.status(403).json({
        message: "You Are not allowed to add this domain , you are not Admin",
      });
      const error = new Error(
        "You Are not allowed to add this Domain , you are not Admin"
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
