const express = require('express');
const router = express.Router();
const { Report } = require('../models'); // adjust path if needed

router.post('/', async (req, res) => {
  const { title, username, description } = req.body;

  if (!title || !username || !description) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const newReport = await Report.create({ title, username, description });
    res.json(newReport);
  } catch (error) {
    console.error("Failed to create report:", error);
    res.status(500).json({ error: "Failed to create report" });
  }
});

module.exports = router;
