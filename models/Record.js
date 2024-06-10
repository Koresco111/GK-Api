const mongoose = require("mongoose");

const RecordSchema = new mongoose.Schema(
  {
    tallyNum: {
      type: String,
      required: true,
    },
    photo: {
      type: String,
      required: false,
    },
    plateNum: {
      type: String,
      required: true,
    },
    checkout: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Record", RecordSchema);
