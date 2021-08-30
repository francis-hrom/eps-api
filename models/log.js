const mongoose = require("mongoose");

const logSchema = new mongoose.Schema({
  // Log
  date: {
    type: Date,
    required: true,
    default: Date.now,
  },
  level: {
    type: String,
    enum: ["INFO", "WARN", "ERROR", "FATAL"],
    default: "ERROR",
  },
  message: {
    type: String,
    required: true,
  },
  details: {
    type: String,
  },
});

module.exports = mongoose.model("Log", logSchema);
