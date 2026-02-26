const mongoose = require("mongoose");

const complaintSchema = new mongoose.Schema({
  studentName: String,
  message: String,
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Complaint", complaintSchema);