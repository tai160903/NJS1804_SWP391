const express = require("express");
const app = express();
const homeRoute = require("./routes/homeRoute");
const port = process.env.PORT || 3000;
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
mongoose
  .connect("mongodb://127.0.0.1:27017/happymilk")
  .then(() => console.log("Database connected!"))
  .catch((err) => console.log("Database false: ", err));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/", homeRoute);

app.listen(port, () => {
  console.log(`Server started port: ${port}`);
});
