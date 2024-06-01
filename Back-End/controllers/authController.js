const accountModel = require("../models/accountModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

let refeshTokenArray = [];
const authController = {
  register: async (req, res) => {
    try {
      var { username, password, email } = req.body;
      username = username.trim();
      password = password.trim();
      email = email.trim();
      if (!/^[a-zA-Z0-9]*$/.test(username)) {
        res.json({
          status: "FAILED",
          message: "Invalid username fields!",
        });
      } else if (!/^[\w-\.]+@([\w-]+\.+[\w-]{2,4})$/.test(email)) {
        res.json({
          status: "FAILED",
          message: "Invalid email!",
        });
      } else {
        const salt = await bcrypt.genSalt(10);
        const hashed = await bcrypt.hash(password, salt);
        const newAccount = await new accountModel({
          username: username,
          password: hashed,
          email: email,
        });
        const account = await newAccount.save();
        res.status(200).json(account);
      }
    } catch (err) {
      res.status(500).json(err);
    }
  },

  generateAccessToken: (account) => {
    return jwt.sign(
      {
        id: account.id,
        admin: account.isAdmin,
      },
      process.env.JWT_ACCESS_KEY,
      {
        expiresIn: "1d",
      }
    );
  },

  generateRefeshToken: (account) => {
    return jwt.sign(
      {
        id: account.id,
        admin: account.isAdmin,
      },
      process.env.JWT_REFESH_KEY,
      {
        expiresIn: "365d",
      }
    );
  },

  login: async (req, res) => {
    try {
      const account = await accountModel.findOne({
        username: req.body.username,
      });
      if (!account) {
        return res.status(404).json("Wrong username");
      }
      const validPassword = await bcrypt.compare(
        req.body.password,
        account.password
      );
      if (!validPassword) {
        res.status(404).json("Wrong password");
      }
      if (account && validPassword) {
        const accessToken = authController.generateAccessToken(account);
        const refeshToken = authController.generateRefeshToken(account);
        refeshTokenArray.push(refeshToken);
        res.cookie("refeshToken", refeshToken, {
          httpOnly: true,
          secure: false, //deploy chuyen thanh true
          path: "/",
          sameSite: "strict",
        });
        const { password, ...others } = account._doc;
        res.status(200).json({ ...others, accessToken });
      }
    } catch (err) {
      res.status(500).json(err);
    }
  },

  requestRefeshToken: async (req, res) => {
    //take refesh token from user
    const refeshToken = req.cookies.refeshToken;
    if (!refeshToken) return res.status(401).json("You're not authenticated!");
    if (!refeshTokenArray.includes(refeshToken)) {
      return res.status(403).json("Refresh token is not valid");
    }
    jwt.verify(refeshToken, process.env.JWT_REFESH_KEY, (err, account) => {
      if (err) {
        console.log(err);
      }
      refeshTokenArray = refeshTokenArray.filter(
        (token) => token !== refeshToken
      );
      const newAccessToken = authController.generateAccessToken(account);
      const newRefeshToken = authController.generateRefeshToken(account);
      refeshTokenArray.push(newRefeshToken);
      res.cookie("refeshToken", newRefeshToken, {
        httpOnly: true,
        secure: false, //deploy chuyen thanh true
        path: "/",
        sameSite: "strict",
      });
      res.status(200).json({ accessToken: newAccessToken });
    });
  },

  logout: async (req, res) => {
    res.clearCookie("refeshToken");
    refeshTokenArray = refeshTokenArray.filter(
      (token) => token !== req.cookies.refeshToken
    );
    res.status(200).json("Logout successfully");
  },
};

module.exports = authController;
