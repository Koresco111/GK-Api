// const router = require("express").Router();
// const User = require("../models/User");
// const CryptoJS = require("crypto-js");
// const jwt = require("jsonwebtoken");

// // to register users

// router.post("/register", async (req, res) => {
//   try {
//     const { username, email, password } = req.body;
//     const newUser = new User({
//       username,
//       email,
//       password,
//     });
//     const user = await newUser.save();

//     // Create a JWT token
//     const token = jwt.sign(
//       { _id: user._id, isAdmin: user.isAdmin },
//       process.env.SECRET,
//       { expiresIn: "10h" }
//     );
//     res.status(200).json({
//       message: "User registered successfully",
//       user: {
//         _id: user._id,
//         username: user.username,
//         email: user.email,
//         isAdmin: user.isAdmin,
//       },
//       token: token,
//     });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // TO LOGIN USERS

// router.post("/login", async (req, res) => {
//   try {
//     const user = await User.findOne({ username: req.body.username });
//     if (!user) {
//       return res.status(400).json({ message: "User not found" });
//     }
//     const decryptedPassword = CryptoJS.AES.decrypt(
//       user.password,
//       process.env.SECRET
//     ).toString(CryptoJS.enc.Utf8);
//     if (req.body.password !== decryptedPassword) {
//       return res.status(400).json({ message: "Invalid Credentials!" });
//     }

//     const accessToken = jwt.sign(
//       { id: user._id, username: user.username, isAdmin: user.isAdmin },
//       process.env.SECRET,
//       { expiresIn: "24h" }
//     );

//     const { password, ...info } = user._doc;
//     res.status(200).json({ ...info, accessToken });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json("Something went wrong");
//   }
// });
// module.exports = router;

// routes/auth.js

const router = require("express").Router();
const User = require("../models/User.js");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");

// to register users
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Encrypt the password
    const encryptedPassword = CryptoJS.AES.encrypt(
      password,
      process.env.SECRET
    ).toString();

    // Create a new user
    const newUser = await User.create({
      username,
      email,
      password: encryptedPassword,
    });

    // Create a JWT token
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

    // Find the user by username
    const user = await User.findOne({ where: { username } });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // Decrypt and compare passwords
    const decryptedPassword = CryptoJS.AES.decrypt(
      user.password,
      process.env.SECRET
    ).toString(CryptoJS.enc.Utf8);
    if (password !== decryptedPassword) {
      return res.status(400).json({ message: "Invalid Credentials!" });
    }

    // Create JWT token
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
