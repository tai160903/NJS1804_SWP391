const mongoose = require("mongoose");

const Schema = new mongoose.Schema();
const refeshTokenSchema = new Schema(
  {
    token: String,
    account: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Account",
    },
  },
  {
    collection: "refeshToken",
  }
);

const refeshTokenModel = mongoose.model("refeshToken", refeshTokenSchema);

module.exports = refeshTokenModel;
