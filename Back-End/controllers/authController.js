const accountModel = require("../models/accountModel");
const bcrypt = require("bcrypt");

module.exports = {
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
        res.status(200).json(account);
      }
    } catch (err) {
      res.status(500).json(err);
    }
  },
};
