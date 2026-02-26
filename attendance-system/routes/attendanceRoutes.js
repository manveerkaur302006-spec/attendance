// const express = require("express");
// const router = express.Router();
// const Attendance = require("../models/Attendance");
// const Student = require("../models/Student");
// const Class = require("../models/Class");


// // ✅ 1️⃣ Mark Attendance (Class Aware + Duplicate Prevention)
// router.post("/", async (req, res) => {
//   try {
//     const { rollNo, date, status } = req.body;

//     // Find student with class populated
//     const student = await Student.findOne({ rollNo }).populate("class");

//     if (!student) {
//       return res.status(404).json({ message: "Student not found" });
//     }

//     // Prevent duplicate for same class + date
//     const existing = await Attendance.findOne({
//       rollNo,
//       date,
//       class: student.class._id
//     });

//     if (existing) {
//       return res.json({ message: "Attendance already marked for this class today" });
//     }

//     const newAttendance = new Attendance({
//       rollNo,
//       date,
//       status,
//       student: student._id,
//       class: student.class._id
//     });

//     await newAttendance.save();

//     res.json(newAttendance);

//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: err.message });
//   }
// });


// // ✅ 2️⃣ Get Attendance By Date (Class Wise)
// router.get("/date/:classId/:date", async (req, res) => {
//   try {
//     const { classId, date } = req.params;

//     const records = await Attendance.find({
//       class: classId,
//       date
//     }).populate("student");

//     res.json(records);

//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: err.message });
//   }
// });


// // ✅ 3️⃣ Student Attendance Summary (Roll No + Class)
// router.get("/summary/:classId/:rollNo", async (req, res) => {
//   try {
//     const { classId, rollNo } = req.params;

//     const records = await Attendance.find({
//       class: classId,
//       rollNo
//     });

//     const totalLectures = records.length;

//     const presentLectures = records.filter(
//       (r) => r.status === "Present"
//     ).length;

//     const absentLectures = totalLectures - presentLectures;

//     const percentage =
//       totalLectures === 0
//         ? 0
//         : ((presentLectures / totalLectures) * 100).toFixed(2);

//     res.json({
//       totalLectures,
//       presentLectures,
//       absentLectures,
//       percentage,
//     });

//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: err.message });
//   }
// });


// // ✅ 4️⃣ Class Overall Summary
// router.get("/class-summary/:classId", async (req, res) => {
//   try {
//     const classId = req.params.classId;

//     const records = await Attendance.find({ class: classId });

//     const total = records.length;
//     const present = records.filter(
//       (r) => r.status === "Present"
//     ).length;

//     const absent = total - present;

//     const percentage =
//       total === 0
//         ? 0
//         : ((present / total) * 100).toFixed(2);

//     res.json({
//       total,
//       present,
//       absent,
//       percentage,
//     });

//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: err.message });
//   }
// });


// module.exports = router;
const express = require("express");
const router = express.Router();
const Attendance = require("../models/Attendance");
const Student = require("../models/Student");


// =======================================================
// 1️⃣ MARK ATTENDANCE (Class Aware)
// =======================================================
// router.post("/", async (req, res) => {
//   try {
//     const { rollNo, date, status } = req.body;

//     if (!rollNo || !date || !status) {
//       return res.status(400).json({ message: "All fields required" });
//     }

//     const student = await Student.findOne({ rollNo });

//     if (!student) {
//       return res.status(404).json({ message: "Student not found" });
//     }

//     // Prevent duplicate attendance same day
//     const existing = await Attendance.findOne({
//       student: student._id,
//       date
//     });

//     if (existing) {
//       existing.status = status;
//       await existing.save();
//       return res.json({ message: "Attendance updated" });
//     }

//     const newAttendance = new Attendance({
//       student: student._id,
//       class: student.class,
//       date,
//       status
//     });

//     await newAttendance.save();

//     res.status(201).json(newAttendance);

//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: err.message });
//   }
// });

router.post("/", async (req, res) => {
  try {
    const { rollNo, date, status, classId } = req.body;

    if (!rollNo || !date || !status || !classId) {
      return res.status(400).json({ message: "All fields required" });
    }

    // 🔥 IMPORTANT: find student by roll + class
    const student = await Student.findOne({
      rollNo,
      class: classId
    });

    if (!student) {
      return res.status(404).json({ message: "Student not found in this class" });
    }

    const existing = await Attendance.findOne({
      student: student._id,
      date,
      class: classId
    });

    if (existing) {
      existing.status = status;
      await existing.save();
      return res.json({ message: "Attendance updated" });
    }

    const newAttendance = new Attendance({
      student: student._id,
      class: classId,
      date,
      status
    });

    await newAttendance.save();

    res.status(201).json(newAttendance);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});
// =======================================================
// 2️⃣ GET ATTENDANCE BY DATE (Class Wise)
// =======================================================
router.get("/date/:classId/:date", async (req, res) => {
  try {
    const { classId, date } = req.params;

    const records = await Attendance.find({
      class: classId,
      date
    }).populate("student");

    res.json(records);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});


// =======================================================
// 3️⃣ STUDENT SUMMARY (Per Class)
// =======================================================
router.get("/student-summary/:classId/:rollNo", async (req, res) => {
  try {
    const { classId, rollNo } = req.params;

    const student = await Student.findOne({
      rollNo,
      class: classId
    });

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    const records = await Attendance.find({
      student: student._id,
      class: classId
    });

    const total = records.length;
    const present = records.filter(r => r.status === "Present").length;
    const absent = total - present;

    const percentage =
      total === 0 ? 0 : ((present / total) * 100).toFixed(2);

    res.json({
      total,
      present,
      absent,
      percentage
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});


// =======================================================
// 4️⃣ CLASS SUMMARY
// =======================================================
router.get("/class-summary/:classId", async (req, res) => {
  try {
    const { classId } = req.params;

    const records = await Attendance.find({ class: classId });

    const total = records.length;
    const present = records.filter(r => r.status === "Present").length;
    const absent = total - present;

    const percentage =
      total === 0 ? 0 : ((present / total) * 100).toFixed(2);

    res.json({
      total,
      present,
      absent,
      percentage
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;