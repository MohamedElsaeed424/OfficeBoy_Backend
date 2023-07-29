require("dotenv").config();
const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

app.use(express.json());

app.get("/user", authenticateToken, async (req, res) => {
  const userId = req.user.id;
  const user = await prisma.usersTBL.findUnique({
    where: {
      //id: userId,
      userid: userId, //my edit
    },
    select: {
      firstname: true,
      lastname: true,
      email: true,
      role: true,
    },
  });
  if (!user) {
    return res.sendStatus(401);
  }
  res.json(user);
});

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  console.log(authHeader);
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decodedToken) => {
    console.log(err);
    if (err) return res.sendStatus(403);
    req.user = decodedToken;
    next();
  });
}

// app.listen(3000);
