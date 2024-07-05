const { DataTypes } = require("sequelize");
const sequelize = require("../config.js"); 

const Record = sequelize.define(
  "Record",
  {
    tallyNum: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    photo: {
      type: DataTypes.STRING,
      allowNull: true, 
    },
    plateNum: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    checkout: {
      type: DataTypes.BOOLEAN,
      defaultValue: false, 
    },
  },
  {
    timestamps: true, 
    underscored: true,
  }
);

module.exports = Record;
