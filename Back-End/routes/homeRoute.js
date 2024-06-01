const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const authController = require("../controllers/authController");
const jwtMilddleware = require("../controllers/jwtMilddleware");

router.get("/", productController.getAll);
router.post("/login", authController.login);
router.post("/register", authController.register);
router.post("/refesh", authController.requestRefeshToken);
router.post("/logout", jwtMilddleware.verifyToken, authController.logout);
module.exports = router;
