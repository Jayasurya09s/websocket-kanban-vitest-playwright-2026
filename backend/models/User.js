const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: String,
  email: String,

  socketId: String, // for realtime tracking

  lastSeen: Date
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
