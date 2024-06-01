const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const accountSchema = new Schema(
  {
    username: {
      type: String,
      require: true,
      minlength: 5,
      maxlength: 20,
      unique: true,
    },
    password: {
      type: String,
      require: true,
      minlength: 6,
    },
    email: {
      type: String,
      require: true,
      unique: true,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    phone: {
      type: String,
      require: true,
    },
  },
  {
    collection: "account",
    timestamps: true,
  }
);

const accountModel = mongoose.model("account", accountSchema);

module.exports = accountModel;
