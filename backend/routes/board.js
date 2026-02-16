const express = require("express");
const boardService = require("../services/boardService");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const board = await boardService.getBoard();
    res.json(board);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put("/settings", async (req, res) => {
  try {
    const board = await boardService.updateBoard(req.body || {});
    res.json(board);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
