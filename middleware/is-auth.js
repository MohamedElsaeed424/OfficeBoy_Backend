const express = require("express");
const app = express();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const jwt = require("jsonwebtoken");
//const tokensecret = 'mysecretkey569';
//-----------------jwt passport------------------------------------>
// var passport = require('passport')
//   , LocalStrategy = require('passport-local').Strategy;

// app.post('/login', function(req, res, next) {
//   passport.authenticate('local', function(err, user, info) {
//     if (err) { return next(err) }
//     if (!user) {
//       return res.json(401, { error: 'message' });
//     }
//     //user has authenticated correctly thus we create a JWT token
//     var token = jwt.encode({ email: email}, tokenSecret);
//     res.json({ token : token });

//   })(req, res, next);
// });

// passport.use(new LocalStrategy(
//   function(username, password, done) {
//     UsersTBL.findOne({ username: username }, function(err, user) {
//       if (err) { return done(err); }
//       if (!user) {
//         return done(null, false, { message: 'Incorrect username.' });
//       }
//       if (!user.validPassword(password)) {
//         return done(null, false, { message: 'Incorrect password.' });
//       }
//       if (!user.validMail(email)) {
//         return done(null, false, { message: 'Incorrect email.' });
//       }
//       return done(null, user);
//     });
//   }
// ));

//-----------------jwt passport------------------------------------>

module.exports = async (req, res, next) => {
  // let authHeader = req.get("Authorization");
  const authHeader = req.headers["authorization"];
  //-----------------If i cant fetch the Autherization header from frontend------------------
  if (!authHeader) {
    res.status(401).json({ message: "Not Authenticated" });
    const error = new Error("Not Authenticated");
    error.statusCode = 401;
    throw error;
  }
  const token = authHeader.split(" ")[1];
  let decodedToken;
  //---------------------Varify the Token------------------------------------
  try {
    decodedToken = jwt.verify(token, "MY_ACCESS_SECRET_TOKEN_GENERATED");
    if (!decodedToken) {
      res.status(401).json({ message: "Not Authenticated" });
      const error = new Error("Not Authenticated");
      error.statusCode = 401;
      throw error;
    }
    const checkToken = await prisma.tokensTBL.findUnique({
      where: {
        token: token,
      },
    });
    if (!checkToken) {
      res.status(403).json({ message: "login first" });
      const error = new Error("login first");
      error.statusCode = 403;
      throw error;
    }
    if (checkToken.blackListedToken) {
      res.status(403).json({
        message: "You are blocked , You can not perform this request",
      });
      const error = new Error(
        "You are blocked ,You can not perform this request"
      );
      error.statusCode = 403;
      throw error;
    }
    req.accessToken = token;
    req.userId = decodedToken.userId;
    next();
  } catch (err) {
    console.log(err);
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
    return err;
  }
};
