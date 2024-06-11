// const mongoose = require("mongoose");
// const CryptoJS = require("crypto-js");

// const UserSchema = new mongoose.Schema(
//   {
//     username: {
//       type: String,
//       required: true,
//       unique: true,
//     },
//     email: {
//       type: String,
//       required: true,
//       unique: true,
//     },
//     password: {
//       type: String,
//       required: true,
//     },
//     isAdmin: {
//       type: Boolean,
//       default: false,
//     },
//   },
//   { timestamps: true }
// );

// UserSchema.pre("save", function (next) {
//   if (!this.isModified("password")) {
//     return next();
//   }
//   const encryptedPassword = CryptoJS.AES.encrypt(
//     this.password,
//     process.env.SECRET
//   ).toString(); // Replace 'your_secret_key' with your actual secret key
//   this.password = encryptedPassword;
//   next();
// });

// module.exports = mongoose.model("User", UserSchema);
// models/User.js

const { DataTypes } = require("sequelize");
const sequelize = require("../config.js"); // Import the Sequelize instance
const CryptoJS = require("crypto-js");

const User = sequelize.define(
  "User",
  {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true, // Ensure email format is valid
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isAdmin: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
    underscored: true, // Converts camelCase column names to snake_case
    hooks: {
      beforeSave: async (user, options) => {
        if (user.changed("password")) {
          const encryptedPassword = CryptoJS.AES.encrypt(
            user.password,
            process.env.SECRET
          ).toString(); // Replace 'your_secret_key' with your actual secret key
          user.password = encryptedPassword;
        }
      },
    },
  }
);

module.exports = User;
