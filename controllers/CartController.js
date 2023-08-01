const express = require("express");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const app = express();

app.use(express.json());

//find unique user
exports.addItem = async (req, res, next) => {
  const user = await prisma.UsersTBL.findUnique({
    where: {
      userid: req.userId,
    },
  });
  console.log(user);
  console.log(user.userid);
};

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
app.post("/cart", async (req, res) => {
  const { CartItems } = req.body;

  try {
    // Find the user by userid
    const user = await prisma.UsersTBL.findUnique({
      where: {
        userid: req.userId,
      },
    });

    if (!user) {
      // Handle the case when the user with the provided userid is not found
      return res.status(404).json({ error: "User not found" });
    }

    // Create a new record in the cartTBL with empId
    const newCart = await prisma.CartTBL.create({
      data: {
        empid: user.userid, // Assuming user.userid represents the employee id
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
    res.status(500).json({ error: "Internal server error" });
  }
});

// app.post("/cart", async (req, res) => {
//     const { empid, CartItems } = req.body;
//     try {
//         // this will create new record in the cartTBL with empId
//         const newCart = await prisma.cartTBL.create({
//             data: {
//                 creator: {
//                     connect: {
//                         userid: req.userId,
//                     },
//                 },
//                 CartItems: {
//                     createMany: {
//                         // we are creating multiple CartItems records
//                         data: CartItems,
//                     },
//                 },
//             },
//             include: { CartItems: true }, // It specifies that we want to include the related CartItems associated with the newly created cart in the response.
//         });
//         res.json(newCart);
//     } catch (error) {
//         res.status(500).json({ error: "Internal server error" });
//     }
// });

// const PORT = 3000;
// app.listen(PORT, () => {
//     console.log(`Server started on http://localhost:${PORT}`);
// });
