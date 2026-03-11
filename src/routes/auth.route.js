const express = require("express");
const authControllers = require("../controllers/auth.controller.js");



const router = express.Router();

router.post("/register", authControllers.userRegisterController);
router.post("/login", authControllers.userLoginController);

router.post("/logout", auth)

module.exports = router;