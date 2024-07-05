
const router = require("express").Router();
const User = require("../models/User.js");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");
require("dotenv").config();


// to register users
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    
    const newUser = await User.create({
      username,
      email,
      password, 
    });

    
    const token = jwt.sign(
      { id: newUser.id, username: newUser.username, isAdmin: newUser.isAdmin },
      process.env.SECRET,
      { expiresIn: "10h" }
    );

    res.status(200).json({
      message: "User registered successfully",
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        isAdmin: newUser.isAdmin,
      },
      token,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Registration failed" });
  }
});

// TO LOGIN USERS
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    
    const user = await User.findOne({ where: { username } });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    
    const isMatch = user.validPassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid Credentials!" });
    }

    
    const accessToken = jwt.sign(
      { id: user.id, username: user.username, isAdmin: user.isAdmin },
      process.env.SECRET,
      { expiresIn: "24h" }
    );

    res.status(200).json({
      id: user.id,
      username: user.username,
      email: user.email,
      isAdmin: user.isAdmin,
      accessToken,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json("Something went wrong");
  }
});

module.exports = router;
