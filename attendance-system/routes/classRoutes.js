const express = require("express");
const router = express.Router();
const Class = require("../models/Class");

// Add Class
router.post("/", async (req, res) => {
  try {
    const { className } = req.body;

    const newClass = new Class({ className });
    await newClass.save();

    res.json(newClass);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get All Classes
router.get("/", async (req, res) => {
  const classes = await Class.find();
  res.json(classes);
});

module.exports = router;