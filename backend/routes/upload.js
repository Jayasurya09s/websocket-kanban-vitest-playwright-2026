const express = require("express");
const multer = require("multer");
const cloudinary = require("../config/cloudinary");
const taskService = require("../services/taskService");

const router = express.Router();

// use memory storage (not disk)
const storage = multer.memoryStorage();

const allowedTypes = [
  "image/png",
  "image/jpeg",
  "image/jpg",
  "application/pdf"
];

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    if (allowedTypes.includes(file.mimetype)) cb(null, true);
    else cb(new Error("Only images and PDFs allowed"), false);
  }
});

// ================= UPLOAD ROUTE =================
router.post("/", upload.single("file"), async (req, res) => {
  try {
    const { taskId, user } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "File missing" });
    }

    if (!taskId) {
      return res.status(400).json({ message: "taskId required" });
    }

    // upload buffer to cloudinary
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          folder: "kanban_tasks",
          resource_type: "auto"
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      ).end(req.file.buffer);
    });

    const fileData = {
      name: req.file.originalname,
      url: result.secure_url,
      type: req.file.mimetype,
      size: req.file.size
    };

    // save in mongo + attach to task
    const actor = user || "cloud-user";
    const attachment = await taskService.addAttachment(taskId, fileData, actor);

    res.json({
      message: "uploaded",
      attachment
    });

  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
