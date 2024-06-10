const User = require("../models/User");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const AdminMiddleware = async (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json({ message: "Access Denied: No Token Provided!" });
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET);
    const userId = decoded.id;
    const user = await User.findById(userId, "isAdmin");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (user.isAdmin) {
      next();
    }
  } catch (err) {
    res.status(400).json({ message: "Invalid Token" });
    console.log(err);
  }
};

module.exports = AdminMiddleware;
