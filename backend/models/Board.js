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

  background: {
    type: String,
    default: "aurora"
  },

  swimlaneMode: {
    type: String,
    enum: ["none", "priority", "member"],
    default: "none"
  },

  powerUps: {
    type: Object,
    default: {
      calendar: false,
      analytics: true
    }
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
