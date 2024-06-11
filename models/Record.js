// const mongoose = require("mongoose");

// const RecordSchema = new mongoose.Schema(
//   {
//     tallyNum: {
//       type: String,
//       required: true,
//     },
//     photo: {
//       type: String,
//       required: false,
//     },
//     plateNum: {
//       type: String,
//       required: true,
//     },
//     checkout: {
//       type: Boolean,
//       default: false,
//     },
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model("Record", RecordSchema);
// models/Record.js

const { DataTypes } = require("sequelize");
const sequelize = require("../config.js"); // Import the Sequelize instance

const Record = sequelize.define(
  "Record",
  {
    tallyNum: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    photo: {
      type: DataTypes.STRING,
      allowNull: true, // You can specify allowNull as true for optional fields
    },
    plateNum: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    checkout: {
      type: DataTypes.BOOLEAN,
      defaultValue: false, // Sequelize uses defaultValue instead of default
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
    underscored: true, // Converts camelCase column names to snake_case
    // Other options like tableName, indexes, etc.
  }
);

module.exports = Record;
