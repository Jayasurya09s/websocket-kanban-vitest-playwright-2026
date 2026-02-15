const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({

  title: {
    type: String,
    required: true,
    trim: true
  },

  description: {
    type: String,
    default: ""
  },

  column: {
    type: String,
    enum: ["todo", "in-progress", "done"],
    default: "todo"
  },

  priority: {
    type: String,
    enum: ["low", "medium", "high"],
    default: "medium"
  },

  category: {
    type: String,
    enum: ["bug", "feature", "enhancement"],
    default: "feature"
  },

  boardId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Board",
    required: true
  },

  attachments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Attachment"
    }
  ],

  createdBy: {
    type: String,
    default: "anonymous"
  },

  updatedBy: {
    type: String,
    default: "anonymous"
  },

  isDeleted: {
    type: Boolean,
    default: false
  }

}, { timestamps: true });

module.exports = mongoose.model("Task", taskSchema);
