const express = require("express");
const router = express.Router();
const activityService = require("../services/activityService");

// get board activity
router.get("/board/:boardId", async (req, res) => {
  try {
    const data = await activityService.getBoardActivity(req.params.boardId);
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// get task activity
router.get("/task/:taskId", async (req, res) => {
  try {
    const data = await activityService.getTaskActivity(req.params.taskId);
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
