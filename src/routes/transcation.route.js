const express = require("express");
const { authMiddleware, authSystemUserMiddleware } = require("../middlewares/auth.middleware");
const {createTransaction, createInitialFundsTransaction} = require("../controllers/transaction.controller.js")
const transcationRoute = express.Router();

transcationRoute.post("/",authMiddleware, createTransaction);



// create initial funds for the system

transcationRoute.post("/system/initial-funds", authSystemUserMiddleware, createInitialFundsTransaction);

// create a new transaction
transcationRoute.post("/", authMiddleware, createTransaction);




module.exports = transcationRoute

