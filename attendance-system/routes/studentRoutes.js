const express = require("express");
const router = express.Router();
const Student = require("../models/Student");


// ✅ 1️⃣ Add Student (Class-Wise Unique Roll)
router.post("/", async (req, res) => {
  try {
    const { name, rollNo, class: classId } = req.body;

    if (!name || !rollNo || !classId) {
      return res.status(400).json({
        message: "Name, Roll No and Class are required"
      });
    }

    // Check duplicate only inside that class
    const existing = await Student.findOne({
      rollNo,
      class: classId
    });

    if (existing) {
      return res.status(400).json({
        message: "Roll number already exists in this class"
      });
    }

    const newStudent = new Student({
      name,
      rollNo,
      class: classId
    });

    await newStudent.save();

    res.status(201).json(newStudent);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});


// ✅ 2️⃣ Get Students (Optional Class Filter)
router.get("/", async (req, res) => {
  try {
    const { classId } = req.query;

    if (classId) {
      const students = await Student.find({ class: classId });
      return res.json(students);
    }

    const students = await Student.find();
    res.json(students);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});


// ✅ 3️⃣ Delete Student (Optional but Good Practice)
router.delete("/:id", async (req, res) => {
  try {
    await Student.findByIdAndDelete(req.params.id);
    res.json({ message: "Student deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;