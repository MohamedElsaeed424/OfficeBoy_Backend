const { body, validationResult } = require("express-validator");
const dns = require("dns");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

module.exports = async (req, res, next) => {
  try {
    if (req.body.email) {
      const userEmail = req.body.email;
      const userEmailDomain = userEmail.substring(
        userEmail.lastIndexOf("@") + 1
      );
      const emailDomain = await prisma.DomainsTBL.findUnique({
        where: {
          domain: userEmailDomain,
        },
      });
      console.log(emailDomain);

      if (!emailDomain) {
        res.status(403).json({ message: "This domain is not valid" });
        const error = new Error("This domain is not valid");
        error.statusCode = 403;
        throw error;
      }
    }
    next();
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
    return err;
  }
};
