const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path") ;

const authRoutes = require("./routes/auth");

const app = express() ;
// --------------to handel cors errors---------------------------
const corsOptions = {credential: true, origin : process.env.URL || '*'};
app.use(cors(corsOptions));
//------------------------------------------------------------------

app.use(bodyParser.json());

app.use(authRoutes) ;

app.connect(8080);