const express = require("express");
const router = express.Router();
const Complaint = require("../models/Complaint");

// Submit Complaint
router.post("/", async (req, res) => {
  try {
    const { studentName, message } = req.body;

    const newComplaint = new Complaint({
      studentName,
      message
    });

    await newComplaint.save();
    res.json(newComplaint);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get All Complaints
router.get("/", async (req, res) => {
  try {
    const complaints = await Complaint.find().sort({ date: -1 });
    res.json(complaints);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete Complaint
router.delete("/:id", async (req, res) => {
  try {
    await Complaint.findByIdAndDelete(req.params.id);
    res.json({ message: "Complaint Deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;