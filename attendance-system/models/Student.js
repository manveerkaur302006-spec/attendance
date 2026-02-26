const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  name: String,
  rollNo: String,
  class: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Class"
  }
});

// 🔥 Compound Unique Index
studentSchema.index({ rollNo: 1, class: 1 }, { unique: true });

module.exports = mongoose.model("Student", studentSchema);