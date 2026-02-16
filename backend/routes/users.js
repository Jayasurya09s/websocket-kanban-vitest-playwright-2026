const express = require("express");
const User = require("../models/User");

const router = express.Router();

// List users for member assignment
router.get("/", async (req, res) => {
  try {
    const users = await User.find({}, { username: 1, email: 1 }).sort({ username: 1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
