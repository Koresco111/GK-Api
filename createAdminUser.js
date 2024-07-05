const { Sequelize } = require("sequelize");
const jwt = require("jsonwebtoken");
const User = require("./models/User");
require("dotenv").config();
const sequelize = new Sequelize({
  dialect: "mysql",
  host: process.env.DATABASE_HOST,
  port: process.env.DATABASE_PORT,
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
});

const SECRET = "secret111";

async function createAdminUser(username, email, password) {
  try {
    // Authenticate Sequelize
    await sequelize.authenticate();

    // Define the User model
    const userModel = User(sequelize, Sequelize);

    // Create new admin user
    const newUser = await userModel.create({
      username,
      email,
      password,
      isAdmin: true,
    });

    // Generate JWT token
    const token = jwt.sign(
      { id: newUser.id, isAdmin: newUser.isAdmin },
      SECRET,
      { expiresIn: "10h" }
    );

    // Log success message
    console.log({
      message: "Admin user created successfully",
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        isAdmin: newUser.isAdmin,
      },
      token,
    });

    // Close Sequelize connection
    await sequelize.close();
  } catch (err) {
    // Handle errors
    console.error(`Error creating admin user: ${err.message}`);

    // Close Sequelize connection on error
    await sequelize.close();
  }
}

module.exports = createAdminUser;
