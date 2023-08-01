const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const multer = require("multer");

const authRoutes = require("./routes/auth");
// const orderRoutes = require("./routes/orders");
const adminRoutes = require("./routes/admin");

const officeBoyRoutes = require("./routes/officeBoy");
const { PrismaClient } = require("@prisma/client");
const isAuth = require("./middleware/is-auth");
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

app.use(bodyParser.json());
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
// app.post("/token", async (req, res) => {
//   const refreshToken = req.body.refreshToken;
//   try {
//     const fetchedRefToken = await prisma.TokensTBL.findUnique({
//       where: {
//         refreshtoken: refreshToken,
//       },
//     });
//     if (!fetchedRefToken) {
//       res.status(404).json({
//         message: "You are not autherized",
//       });
//       const error = new Error("Sorry, No Item to be Updated");
//       error.statusCode = 404;
//       throw error;
//     }
//     jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
//       if (err) return res.sendStatus(404);
//       const accessToken = generateAccessToken({ userid: user.id });
//       res.json({ accessToken: accessToken });
//     });
//   } catch (err) {
//     if (!err.statusCode) {
//       err.statusCode = 500;
//     }
//     // next(err);
//   }
// });
// function generateAccessToken(user) {
//   return jwt.sign(
//     { email: user.email, userId: user.userid },
//     "MY_ACCESS_SECRET_TOKEN_GENERATED",
//     { expiresIn: "2h" }
//   );
// }
app.use("/admin", adminRoutes);
// app.use("/order", orderRoutes);
app.use("/officeBoy", officeBoyRoutes);
app.use("/auth", authRoutes);
//-------------------cart logic-------------------
app.use(express.json());

// GET cart with its items
app.get("/cart/:id", async (req, res) => {
  const cartId = parseInt(req.params.id);
  try {
    //find unique cart record that matches provided cart id < related order item associated with that cart
    const cart = await prisma.CartTBL.findUnique({
      where: { cartid: cartId },
      include: { CartItems: true },
    });
    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST new cart with items
app.post("/cart", isAuth, async (req, res) => {
  const { CartItems } = req.body;

  if (!CartItems) {
    throw Error("CartItems is required");
  }
  try {
    //const accessToken = req.headers.authorization;

    const userId = req.userId;

    console.log(userId);

    const user = await prisma.UsersTBL.findUnique({
      where: {
        userid: userId,
      },
    });
    // Find the user by userid
    // const user = await prisma.UsersTBL.findUnique({
    //   where: {
    //     userid: req.userId,
    //   },
    // });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Create a new record in the cartTBL with empId 1st code
    // const newCart = await prisma.CartTBL.create({
    //   data: {
    //     creator: {
    //       connect: {
    //         empid: userId,
    //       },
    //     },
    //     CartItems: {
    //       createMany: {
    //         data: CartItems,
    //       },
    //     },
    //   },
    //   include: { CartItems: true },
    // });

    // Create a new record in the cartTBL with empId 2nd code
    // const newCart = await prisma.CartTBL.create({
    //   data: {
    //     creator: {
    //       connect: {
    //         empid: userId,
    //       },
    //     },
    //     CartItems: {
    //       createMany: {
    //         data: CartItems,
    //       },
    //     },
    //     employeeid: userId,
    //   },
    //   include: { CartItems: true },
    // });
    //3rd trail

    const newCart = await prisma.CartTBL.create({
      data: {
        empid: userId,
        CartItems: {
          createMany: {
            data: CartItems,
          },
        },
      },
      include: { CartItems: true },
    });

    res.json(newCart);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// app.post("/cart", async (req, res) => {
//   //find unique user
//   const user = await prisma.UsersTBL.findUnique({
//     where: {
//       userid: req.userId,
//     },
//   });
//   console.log(user);
//   console.log(user.userid);
//   if (!user) {
//     return res.status(404).json({ error: "User not found" });
//   }

//   const { CartItems } = req.body;
//   try {
//     // this will create new record in the cartTBL with empId
//     const newCart = await prisma.CartTBL.create({
//       data: {
//         creator: {
//           connect: {
//             userid: user.userid,
//           },
//         },
//         CartItems: {
//           createMany: {
//             // we are creating multiple CartItems records
//             data: CartItems,
//           },
//         },
//       },
//       include: { CartItems: true }, // It specifies that we want to include the related CartItems associated with the newly created cart in the response.
//     });
//     res.json(newCart);
//   } catch (error) {
//     res.status(500).json({ error: "Internal server error" });
//   }
// });

//--------------------------------Gnenral Error handling ----------------------------
app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data });
});

app.listen(8080);
