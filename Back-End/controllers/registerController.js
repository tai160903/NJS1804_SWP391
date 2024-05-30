const accountModel = require("../models/accountModel");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");

module.exports = {
  post: (req, res, next) => {
    var { username, password, email } = req.body;
    username = username.trim();
    password = password.trim();
    email = email.trim();
    if (username == "" || email == "" || password == "") {
      res.json({
        status: "FAILED",
        message: "Empty input fields!",
      });
    } else if (!/^[a-zA-Z0-9]*$/.test(username)) {
      res.json({
        status: "FAILED",
        message: "Invalid username fields!",
      });
    } else if (!(username.length >= 6 && username.length <= 20)) {
      res.json({
        status: "FAILED",
        message: "Username only 6 - 20!",
      });
    } else if (!/^[\w-\.]+@([\w-]+\.+[\w-]{2,4})$/.test(email)) {
      res.json({
        status: "FAILED",
        message: "Invalid email!",
      });
    } else if (password.length < 6) {
      res.json({
        status: "FAILED",
        message: "Password at least 6 letter!",
      });
    } else {
      accountModel.find({ $or: [{ username }, { email }] }).then((data) => {
        if (data.length) {
          res.json({
            status: "FAILED",
            message: "Username or Email existed!",
          });
        } else {
          const saltRounds = 10;
          bcrypt
            .hash(password, saltRounds)
            .then((hashedPassword) => {
              const newAccount = new accountModel({
                username,
                password: hashedPassword,
                email,
              });
              newAccount.save().then((data) => {
                res.json({
                  status: "SUCCESS",
                  message: "Resgister successfully!",
                  data: data,
                });
              });
            })
            .catch((err) => {
              res.json({
                status: "FAILED",
                message: "An error occurred while hashing password!",
              });
            });
        }
      });
    }
  },
};
