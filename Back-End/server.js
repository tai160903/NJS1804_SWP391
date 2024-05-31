const express = require("express");
const homeRoute = require("./routes/homeRoute");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const app = express();
dotenv.config();
const port = process.env.PORT || 3000;

mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => console.log("Database connected!"))
  .catch((err) => console.log("Database false: ", err));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(cors());
app.use(cookieParser());
app.use(express.json());

app.use("/", homeRoute);

app.listen(port, () => {
  console.log(`Server started port: ${port}`);
});

//AUTHENTICATION

//AUTORIZATION
