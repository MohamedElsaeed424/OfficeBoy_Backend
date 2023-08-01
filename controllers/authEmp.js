const { validationResult } = require("express-validator");
const path = require("path");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const sgMail = require("@sendgrid/mail");
const markdown = require("markdown-it")();

const express = require("express"); //new
const app = express(); //new

sgMail.setApiKey(
    "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"
);

const bathText = path.join(__dirname, "Email_Design.html");
const emailDesignHtml = markdown.render(bathText);

const catchAsync = (fn) => (req, res, next) => {
    return Promise.resolve(fn(req, res, next)).catch((err) => next(err));
};

exports.signup = catchAsync(async (req, res, next) => {
    try {
        const newEmp = await prisma.EmployeeTBL.create({
            data: {
                romid: {
                    connect: {
                        roomid: req.roomId,
                    },
                },
                offid: {
                    connect: {
                        officeid: req.officeId,
                    },
                },
                emp: {
                    connect: {
                        userid: req.userId,
                    },
                },
            },
        });
        console.log(newEmp);

        res
            .status(201)
            // connect with Front end...
            .json({ message: "User Created Successfully", userId: newUser.userid });
        sgMail.send({
            to: email,
            from: "postman.mord@gmail.com",
            subject: "Your Signup to postman succeeded!",
            html: emailDesignHtml,
        });
    } catch (err) {
        throw new Error(400, err.message);
    }
});
