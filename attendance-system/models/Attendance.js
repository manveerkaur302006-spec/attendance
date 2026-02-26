// const mongoose = require("mongoose");

// const attendanceSchema = new mongoose.Schema({
//   rollNo: String,
//   date: String,
//   status: String,
//   class: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Class"
//   },
//   student: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Student"
//   }
// });

// module.exports = mongoose.model("Attendance", attendanceSchema);

const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({
  date: String,
  status: String,

  class: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Class",
    required: true
  },

  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    required: true
  }
});

module.exports = mongoose.model("Attendance", attendanceSchema);