const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const { urlencoded } = require("express");
const app = express();
require("dotenv").config();
const port = process.env.PORT;

const router = express.Router();
// middleware
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
router.post("/login", async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;

    const user = await userModel.findOne({ email: email });

    if (user) {
      if (password === user.password) {
        res.send({ message: "Login Successfully", auth : true, email : user.email, name : user.name });
        console.log("Login Success", user);
      } else {
        res.send({ message: "Password Didn't Match",auth : false });
        console.log("Wrong Password");
      }
    } else {
      res.send({ message: "User Not registered",auth : false });
      console.log(res);
    }
  } catch (error) {
    console.log(error);
  }

  // userModel
  //   .findOne({ email: email })
  //   .then((user) => {
  //     if (user) {
  //       if (password === user.password) {
  //         res.send({ message: "Login Successfully", user: user });
  //         console.log("Login Success");
  //       } else {
  //         res.send({ message: "Password Didn't Match" });
  //         console.log("Wrong Password");
  //       }
  //     } else {
  //       res.send({ message: "User Not registered" });
  //       console.log(res);
  //     }
  //   })
  //   .catch((err) => console.log(err));
});

router.post("/register", async (req, res) => {
  const { email, password,name } = req.body;
  const user = await userModel.findOne({ email: email });
  try {
    if (user) {
      return res.send({ message: "User Already Exists", register: false });
    } else {
      const user2 = new userModel({
        name,
        email,
        password,
      });
      user2.save((err, result) => {
        if (!err) {
          res.send({ message: "Added Successfully", register: true });
        } else {
          return res.send({ message: "Something Went Wrong", register: false });
        }
      });
    }
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
