const express = require("express");
const router = express.Router();
const homeController = require("../controllers/homeController");
const authController = require("../controllers/authController");

router.get("/", homeController.get);
router.post("/login", authController.login);
router.post("/register", authController.register);

module.exports = router;
