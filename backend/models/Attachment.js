const mongoose = require("mongoose");

const attachmentSchema = new mongoose.Schema({
  fileName: String,
  fileUrl: String,
  fileType: String,
  fileSize: Number,

  uploadedBy: {
    type: String,
    default: "unknown"
  }

}, { timestamps: true });

module.exports = mongoose.model("Attachment", attachmentSchema);
