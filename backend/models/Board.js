const mongoose = require("mongoose");

const boardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    default: "Main Board"
  },

  description: {
    type: String,
    default: ""
  },

  columns: {
    type: [String],
    default: ["todo", "in-progress", "done"]
  },

  createdBy: {
    type: String, // later user id
    default: "system"
  }

}, { timestamps: true });

module.exports = mongoose.model("Board", boardSchema);
