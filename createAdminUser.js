const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const User = require("./models/User");

const MONGO_URL =
  "mongodb+srv://jesseugboh:jesseugboh123@cluster0.6edau4r.mongodb.net/gateKeeper?retryWrites=true&w=majority";
const SECRET = "secret111";
async function createAdminUser(username, email, password) {
  try {
    await mongoose.connect(MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    const newUser = new User({
      username,
      email,
      password,
      isAdmin: true,
    });
    const user = await newUser.save();
    const token = jwt.sign({ _id: user._id, isAdmin: user.isAdmin }, SECRET, {
      expiresIn: "10h",
    });
    console.log({
      message: "Admin user created successfully",
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        isAdmin: user.isAdmin,
      },
      token: token,
    });
    mongoose.connection.close();
  } catch (err) {
    console.error(`Error creating admin user: ${err.message}`);
    mongoose.connection.close();
  }
}

module.exports = createAdminUser;
