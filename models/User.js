const mongoose = require("mongoose");
const CryptoJS = require("crypto-js");

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

UserSchema.pre("save", function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  const encryptedPassword = CryptoJS.AES.encrypt(
    this.password,
    process.env.SECRET
  ).toString(); // Replace 'your_secret_key' with your actual secret key
  this.password = encryptedPassword;
  next();
});

module.exports = mongoose.model("User", UserSchema);
