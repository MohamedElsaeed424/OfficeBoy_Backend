require("dotenv").config();
const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcryptjs");

app.use(express.json());

let refreshTokens = [];

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

app.delete("/logout", (req, res) => {
  refreshTokens = refreshTokens.filter((token) => token !== req.body.token);
  res.sendStatus(204);
});

app.post("/login", async (req, res) => {
  console.log("login"); //debug
  const { email, password } = req.body;
  const user = await prisma.usersTBL.findUnique({
    where: {
      email: email,
    },
  });
  console.log(user);
  // console.log('email checked');//debug
  if (!user) {
    console.log("user error");
    return res
      .status(404)
      .json({ error: "Invalid credentials , user not exit" });
  }
  if (user.password !== password) {
    console.log("password error");
    return res
      .status(404)
      .json({ error: "Invalid credentials ,password not found" });
  }
  const accessToken = generateAccessToken({ userid: user.id });
  const refreshToken = jwt.sign(
    { userid: user.id },
    process.env.REFRESH_TOKEN_SECRET
  );
  refreshTokens.push(refreshToken);
  res.json({ accessToken: accessToken, refreshToken: refreshToken });
});

console.log("generateAccessToken"); //debug

function generateAccessToken(user) {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "10 min",
  });
}

// app.listen(4000);
