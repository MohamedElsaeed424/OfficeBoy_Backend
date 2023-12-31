const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const multer = require("multer");
const { initializeApp, applicationDefault } = require("firebase-admin/app");
const { getMessaging } = require("firebase-admin/messaging");
// const serviceAccount = require("./officeboy-397908-firebase-adminsdk-ncjzz-51769ef0f5.json");
const authRoutes = require("./routes/auth/auth");
const orderRoutes = require("./routes/employees/orders");
const adminRoutes = require("./routes/admin/admin");
const cartRoutes = require("./routes/employees/cart");
const categoriesRoutes = require("./routes/admin/categories");
const sitesRoutes = require("./routes/admin/sites");
const rolesRoutes = require("./routes/admin/roles");
const sizesRoutes = require("./routes/admin/sizes");
const domainsRoutes = require("./routes/admin/domains");
const statusRoutes = require("./routes/admin/status");
const upcomingRoutes = require("./routes/officeBoys/upcomingItems");
const finishingRoutes = require("./routes/officeBoys/finishingItems");
const shopRoutes = require("./routes/shop/shop");
const TokenHandler = require("./util/TokenHandler");
const { PrismaClient } = require("@prisma/client");
const isAuth = require("./middleware/is-auth");
const { error } = require("console");
const prisma = new PrismaClient();

const app = express();

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    // cb(null, new Date().toISOString() + "-" + file.originalname);
    cb(null, file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

app.use((req, res, next) => {
  res.setHeader("Content-Type", "application/json");
  next();
});
app.use(bodyParser.json({ type: "application/json" }));
// app.use(bodyParser.json());
app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single("image")
);
app.use(express.static(path.join(__dirname, "public")));
app.use("/images", express.static(path.join(__dirname, "images")));

//---to solve the problem of CORS (different ports) we should set some headers while connecting with Front end---
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type , Authorization");
  next();
});

// check for json data only

initializeApp({
  Credential: applicationDefault(),
  projectId: "potion-for-creator",
});
app.use((err, req, res, next) => {
  if (
    (err instanceof SyntaxError && err.status === 400 && "body" in err) ||
    !req.body
  ) {
    res.status(400).json({ error: "Check your request body" });
  } else {
    next();
  }
});

app.use("/admin", adminRoutes);
app.use("/admin/categories", categoriesRoutes);
app.use("/admin/sites", sitesRoutes);
app.use("/admin/roles", rolesRoutes);
app.use("/admin/sizes", sizesRoutes);
app.use("/admin/domains", domainsRoutes);
app.use("/admin/status", statusRoutes);
app.use("/officeBoy/upcomingData", upcomingRoutes);
app.use("/officeBoy/finishingData", finishingRoutes);
app.use("/order", orderRoutes);
app.use("/shop", shopRoutes);
app.use("/auth", authRoutes);
app.use("/cart", cartRoutes);
app.use((req, res) => {
  res.status(404).json({ message: "this page dosenot exsist" });
});
app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, errors: data });
});

//--------------------------------Gnenral Error handling ----------------------------

app.listen(8080);
