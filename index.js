require("dotenv").config(); 
const express = require("express");
const app = express();
const cors = require("cors");
const sequelize = require("./config"); // Import Sequelize instance

const authRoute = require("./routes/auth.js");
const userRoute = require("./routes/user.js");
const createAdminUser = require("./createAdminUser.js");


app.use(cors());


app.use(express.json());


require("./models/User");
require("./models/Record");


sequelize
  .sync() 
  .then(() => {
    console.log("Database sync complete");
  })
  .catch((error) => {
    console.error("Error syncing database:", error);
  });

app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/records", require("./routes/records"));

app.listen(process.env.PORT, () => {
  console.log(`Backend is running on port ${process.env.PORT}`);
});
