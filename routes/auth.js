const express = require("express");
const User = require("../models/user");
const authRouter = express.Router();
const bcryptjs = require("bcrypt");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth_middleware");

authRouter.post("/api/signup", async (req, res) => {
  try {
    let { name, email, password } = req.body;
    console.log("Request body:", req.body);

    if (!name || !email || !password) {
      return res.status(400).json({ msg: "Please enter all required fields." });
    }

    let  existingUser = await User.findOne({ email });

    if (existingUser) {
      return res
        .status(400)
        .json({ msg: "User with same email already exist" });
    }

    let hashedPassword = await bcryptjs.hash(password, 8);

    let user = new User({
      name,
      email,
      password: hashedPassword,
    });
    user = await user.save();

    return res.json(user);
    // console.log(user);
  } catch (e) {
    if (!res.headersSent) {
      return res.status(500).json({ err: e.message });
    } else {
      console.error("Headers already sent:", e);
    }
  }
  //return the response to user
});

authRouter.post("/api/signin", async (req, res) => {
  try {
    let { email, password } = req.body;
    console.log(req.body);

    if (!email || !password) {
      return res.status(400).json({ msg: "Please enter all required fields." });
    }

    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "User with email doesn't exist" });
    }

    let isMatched = await bcryptjs.compare(password, user.password);
    if (!isMatched) {
      return res.status(400).json({ msg: "Enter correct password" });
    }

    let token = jwt.sign({ id: user._id }, "passwordKey");
    console.log("Token generated:", token);
    console.log("User data:", user._doc);
    res.json({ token, ...user._doc });
  } catch (e) {
    res.status(500).json({ err: e.message });
  }
});

authRouter.post("/tokenIsValid", async (req, res) => {
  try {
    const token = req.header("x-auth-token");
    if (!token) return res.json(false);
    const verified = jwt.verify(token, "passwordKey");
    if (!verified) return res.json(false);
    const user = await User.findById(verified.id);
    if (!user) return res.json(false);
    return res.json(true);
  } catch (e) {
    res.status(500).json({ err: e.message });
  }
});

authRouter.get("/", auth, async (req, res) => {
  const user = await User.findById(req.user);
  if (!user) return res.status(404).json({ msg: "User not found." });

  
  res.json({ ...user._doc, token: req.token });
});

authRouter.get("/api/", async (req, res) => {
  res.json({ msg: "Welcome to the API" });
})


module.exports = authRouter;
