const accountModel = require("../models/accountModel");

module.exports = {
  getAllAccount: (req, res, next) => {
    accountModel
      .find({})
      .then((data) => {
        res.status(200).json(data);
      })
      .catch((err) => {
        res.status(500).json(err);
      });
  },
};
