const express = require("express");
const router = express.Router();
const accountController = require("../controllers/accountController");
const jwtMiddleware = require("../controllers/jwtMilddleware");

// GET ALL ACCOUNT
router.get(
  "/account",
  jwtMiddleware.verifyToken,
  accountController.getAllAccount
);

router.delete("/account/:id");

module.exports = router;
