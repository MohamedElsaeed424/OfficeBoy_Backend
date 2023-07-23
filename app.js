const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path") ;

const authRoutes = require("./routes/auth");

const app = express() ;

app.use(bodyParser.json());


//---to solve the problem of CORS (diffrent ports) we should set some headers while connecting with Front end---
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type , Authorization");
    next();
  });

app.use("/auth" ,authRoutes) ;


//--------------------------------Gnenral Error handling ----------------------------
app.use((error, req, res, next) => {
    console.log(error);
    const status = error.statusCode || 500;
    const message = error.message;
    const data = error.data;
    res.status(status).json({ message: message, data: data });
  });

app.listen(8080);