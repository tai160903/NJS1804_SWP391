const express = require("express");
const router = express.Router();
const homeController = require("../controllers/homeController");
const registerController = require("../controllers/registerController");

router.get("/", homeController.get);
router.get("/signin");
router.post("/signup", registerController.post);

module.exports = router;
