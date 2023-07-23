const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();


exports.signup = async (req, res, next) => {
  const firstname = req.body.firstname;
  const lastname = req.body.lastname;
  const email = req.body.email;
  const role = req.body.role;
  const password = req.body.password;
  //---------------------------Validations--------------------------
  const errors = validationResult(req);
  console.log(errors);
  if (!errors.isEmpty()) {
    const error = new Error("Please Try again , Validation Failed");
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }
  //-------------------------Hashing The Password for security------------------
  try {
    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = await prisma.UsersTBL.create({
      data: {
        firstname: firstname,
        lastname: lastname,
        email: email,
        role: role,
        password: hashedPassword,
      },
    });
    console.log(newUser);
    console.log(newUser.userId);
    res
      .status(201)
      // connect with Front end...
      .json({ message: "User Created Successfully", userId: newUser.userid });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.login = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  try {
    const user = await prisma.UsersTBL.findUnique({
      where: {
        email: email,
      },
    });
    if (!user) {
      const error = new Error("User Not Found , Try Signup");
      error.statusCode = 404;
      throw error;
    }
    const doMatch = await bcrypt.compare(password, user.password);
    if (!doMatch) {
      const error = new Error("Wrong Password");
      error.statusCode = 401;
      throw error;
    }
    //-------------------------------- Adding JWT (json web token) for a user -----------------------
    const token = jwt.sign(
      { email: user.email, userId: user.userid.toString() },
      "MY_SECRET_TOKEN_GENERATED",
      { expiresIn: "1h" }
    );
    //-------------------------------------------------------------------------------------------
    res.status(200).json({ token: token, userId: user.userid.toString() });
    console.log(`${email}: Loged in successfully`);
    return;
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
    return err;
  }
};

exports.logout = async (req, res, next) => {
  const token = req.body.token;
  blacklistToken(token);
  res.json({ message: "Logout successful" });
  console.log("user loged out");
};

async function blacklistToken(token) {
  checkBlacklist();
  await prisma.blacklistedToken.create({
    data: {
      token: token,
    },
  });
}

async function checkBlacklist(req, res, next) {
  const token = req.headers.authorization.split(" ")[1];
  const blacklistedToken = await prisma.blacklistedToken.findUnique({
    where: {
      token: token,
    },
  });
  if (blacklistedToken) {
    return res.status(401).json({ message: "Invalid token" });
  } else {
    next();
  }
}
