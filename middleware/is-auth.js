const express = require("express");
const app = express();

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

module.exports = (req, res, next) => {
  // let authHeader = req.get("Authorization");
  const authHeader = req.headers["authorization"];
  //-----------------If i cant fetch the Autherization header from frontend------------------
  if (!authHeader) {
    const error = new Error("Not Authenticated");
    error.statusCode = 401;
    throw error;
  }
  const token = authHeader.split(" ")[1];
  let decodedToken;
  //---------------------Varify the Token------------------------------------
  try {
    decodedToken = jwt.verify(token, "MY_ACCESS_SECRET_TOKEN_GENERATED");
  } catch (err) {
    err.statusCode = 500;
    throw err;
  }
  //-----------------Check if it exist---------------------------------------
  if (!decodedToken) {
    const error = new Error("Not Authenticated");
    error.statusCode = 401;
    throw error;
  }
  req.userId = decodedToken.userId;
  next();
};

app.post("/token", (req, res) => {
  const refreshToken = req.body.token;
  if (refreshToken == null) return res.sendStatus(401);
  if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403);
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    const accessToken = generateAccessToken({ userid: user.id });
    res.json({ accessToken: accessToken });
  });
});
