// we make the instance of server in app.js but will start the server in server.js

// this is just ti instantiate and configure the server

const express = require("express");
const cookieParser = require("cookie-parser");
const authRoute = require("./routes/auth.route.js");
const accountRoute = require("./routes/account.route.js");
const transcationRoute = require("./routes/transcation.route.js");



const app = express(); // creating the server
app.use(express.json());
app.use(cookieParser());
app.use("/api/auth", authRoute);
app.use("/api/account", accountRoute);
app.use("/api/transaction", transcationRoute);





module.exports = app;
