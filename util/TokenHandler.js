const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const date = new Date();

const generateAccessToken = async (user) => {
  const accessToken = jwt.sign(
    { email: user.email, userId: user.userid },
    "MY_ACCESS_SECRET_TOKEN_GENERATED",
    { expiresIn: "3d" }
  );
  const createdAccessToken = await prisma.TokensTBL.create({
    data: {
      token: accessToken,
      type: "ACCESS",
      createddate: date,
      // createdtime: date,
      expiresIn: extractExpiryDate(accessToken),
      reftoken: {
        connect: {
          userid: user.userid,
        },
      },
    },
  });
  console.log(createdAccessToken);
  return createdAccessToken;
};

const generateRefreshToken = async (user) => {
  const refreshToken = jwt.sign(
    { email: user.email, userId: user.userid },
    "MY_REFRESH_SECRET_TOKEN_GENERATED",
    { expiresIn: "30d" }
  );
  // console.log(refreshToken);
  const createdRefToken = await prisma.TokensTBL.create({
    data: {
      token: refreshToken,
      type: "REFRESH",
      createddate: date,
      // createdtime: date,
      expiresIn: extractExpiryDate(refreshToken),
      reftoken: {
        connect: {
          userid: user.userid,
        },
      },
    },
  });
  console.log(createdRefToken);
  return createdRefToken;
};

function extractExpiryDate(jwtToken) {
  try {
    const decodedToken = jwt.decode(jwtToken, { complete: true });

    if (decodedToken && decodedToken.payload && decodedToken.payload.exp) {
      const expiryTimestamp = decodedToken.payload.exp;
      const expiryDate = new Date(expiryTimestamp * 1000); // Convert to milliseconds

      return expiryDate;
    }
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
    return err;
  }
  return null;
}

exports.generateRefreshToken = generateRefreshToken;

exports.generateAccessToken = generateAccessToken;
