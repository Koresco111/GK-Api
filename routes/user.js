// const router = require("express").Router();
// const User = require("../models/User");
// const Admin = require("../middleware/AdminMiddleware");
// const auth = require("../middleware/authMiddleware");

// // get a single user
// // router.get("/:id", async (req, res) => {
// //   try {
// //     const user = await User.findById(req.params.id);
// //     if (!user) {
// //       return res.status(404).json({ error: "User not found" });
// //     }
// //     const { password, ...info } = user._doc;
// //     res.status(200).json(info);
// //   } catch (err) {
// //     res.status(500).json({ message: err.message });
// //   }
// // });

// // get all users
// router.get("/", Admin, async (req, res) => {
//   try {
//     const users = await User.find();
//     const usersWithoutPassword = users.map(
//       ({ _doc: { password, ...info } }) => info
//     );
//     res.status(200).json(usersWithoutPassword);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// router.delete("/:userId", Admin, async (req, res) => {
//   try {
//     const userId = req.params.userId;

//     // Find the user by ID and delete
//     const user = await User.findByIdAndDelete(userId);

//     if (!user) {
//       return res.status(404).json({ msg: "User not found" });
//     }

//     res.json({ msg: "User account deleted successfully" });
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send("Server Error");
//   }
// });

// module.exports = router;
const express = require("express");
const router = express.Router();
const User = require("../models/User.js"); // Update the model import
const adminMiddleware = require("../middleware/AdminMiddleware");
const authMiddleware = require("../middleware/authMiddleware");

// Get all users
router.get("/", adminMiddleware, async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ["password"] }, // Exclude password field from the result
    });
    res.status(200).json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching users" });
  }
});

// Delete a user by ID
router.delete("/:userId", adminMiddleware, async (req, res) => {
  const { userId } = req.params;

  try {
    // Find the user by ID and delete
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    await user.destroy();
    res.json({ msg: "User account deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error deleting user" });
  }
});

module.exports = router;
