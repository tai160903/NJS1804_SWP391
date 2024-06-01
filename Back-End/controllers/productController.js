const productModel = require("../models/productModel");

module.exports = {
  getAll: (req, res, next) => {
    productModel
      .find({})
      .then((data) => {
        res.json(data);
      })
      .catch((err) => {
        res.status(500).json("Loi khong load duoc du lieu");
      });
  },
};
