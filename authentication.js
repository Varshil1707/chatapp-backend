const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const { urlencoded } = require("express");
const app = express();
require("dotenv").config();
const port = process.env.PORT

const router = express.Router()

app.use(express.json());
app.use(urlencoded());
app.use(cors());
mongoose.set("strictQuery", false);

mongoose.connect("mongodb://127.0.0.1:27017/mern-authentication", () =>
  console.log("Database Connected")
);

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
});

const userModel = new mongoose.model("User", userSchema);

// Defining Route
    router.post("/login", (req, res) => {
  const { email, password } = req.body;
  userModel.findOne({ email: email }, (err, user) => {
    if (user) {
      if (password === user.password ) {
        res.send({ message: "Login Successfully", user: user });
      } else {
        res.send({ message: "Password Didn't Match" });
      }
    } else {
      res.send({ message: "User Not registered" });
    }
  });
});

 app.post("/register", (req, res) => {
  const { email, password } = req.body;

  userModel.findOne({ email: email }, (err, user) => {
    if (user) {
      return res.send({ message: "User Already Exists" });
    }

    const user2 = new userModel({
      email,
      password,
    });
    user2.save((err, result) => {
      if (!err) {
        res.send(result);
      } else {
        return res.send(err);
      }
    });
  });
});

module.exports = router