const express = require("express");
require("dotenv").config();
const router = express.Router();
const User = require("../models/User.js"); 
const adminMiddleware = require("../middleware/AdminMiddleware");
const authMiddleware = require("../middleware/authMiddleware");

// Get all users
router.get("/", adminMiddleware, async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ["password"] }, 
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
