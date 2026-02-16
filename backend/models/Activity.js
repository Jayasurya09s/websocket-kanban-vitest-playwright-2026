const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema({

  action: {
    type: String,
    enum: [
      "TASK_CREATED",
      "TASK_UPDATED",
      "TASK_DELETED",
      "TASK_MOVED",
      "ATTACHMENT_ADDED",
      "TASK_REORDERED"
    ],
    required: true
  },

  taskId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Task"
  },

  boardId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Board"
  },

  performedBy: {
    type: String,
    default: "anonymous"
  },

  metadata: {
    type: Object,
    default: {}
  }

}, { timestamps: true });

module.exports = mongoose.model("Activity", activitySchema);
