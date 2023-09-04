const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.addItem = async (req, res, next) => {
    const user = await prisma.UsersTBL.findUnique({
    where: {
        userid: req.userId,
    },
    });
    console.log(user);
    console.log(user.userid);
};
