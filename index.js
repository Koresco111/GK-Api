const express = require("express");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors"); // Import the CORS package

dotenv.config();

const authRoute = require("./routes/auth.js");
const userRoute = require("./routes/user.js");
const createAdminUser = require("./createAdminUser.js");

// Use CORS middleware
app.use(cors());

// Parse JSON bodies
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("Connected to MongoDB");
    // createAdminUser("adminUser", "admin@example.com", "adminpassword");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });

app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/records", require("./routes/records"));

app.listen(process.env.PORT, () => {
  console.log(`Backend is running on port ${process.env.PORT}`);
});
