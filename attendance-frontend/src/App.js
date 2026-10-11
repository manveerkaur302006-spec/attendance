import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import "./App.css";
import ComplaintSection from "./ComplaintSection";
import ClassSection from "./ClassSection";
import ClassSummary from "./ClassSummary";
import AttendanceSummary from "./AttendanceSummary";
import { API } from "./api";

function App() {
  const [selectedClass, setSelectedClass] = useState("");
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState([]);

  const [name, setName] = useState("");
  const [rollNo, setRollNo] = useState("");

  const today = new Date().toISOString().split("T")[0];

  const fetchStudents = useCallback(async () => {
    if (!selectedClass) return;

    const res = await axios.get(
      `${API}/api/students?classId=${selectedClass}`
    );

    setStudents(res.data);
  }, [selectedClass]);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  const addStudent = async () => {
    if (!name || !rollNo || !selectedClass) {
      return alert("Fill all fields");
    }

    await axios.post(`${API}/api/students`, {
      name,
      rollNo,
      class: selectedClass
    });

    setName("");
    setRollNo("");
    fetchStudents();
  };

  // const markAttendance = async (rollNo, status) => {
  //   if (!selectedClass) return alert("Select class first");

  //   await axios.post(`${API}/api/attendance`, {
  //     rollNo,
  //     date: today,
  //     status
  //   });

  //   alert("Marked");
  // };


  const markAttendance = async (rollNo, status) => {
  if (!selectedClass) return alert("Select class first");

  try {
    await axios.post(`${API}/api/attendance`, {
      rollNo,
      date: today,
      status,
      classId: selectedClass   // 🔥 THIS WAS MISSING
    });

    alert("Marked");
  } catch (err) {
    console.log(err.response?.data || err.message);
    alert("Error marking attendance");
  }
};

  const viewAttendance = async () => {
    if (!selectedClass) return alert("Select class first");

    const res = await axios.get(
      `${API}/api/attendance/date/${selectedClass}/${today}`
    );

    setAttendance(res.data);
  };

  return (
    <div className="container">
      <h1 className="title">📚 Multi-Class Attendance System 💖</h1>

      {/* Class Section */}
      <ClassSection
        selectedClass={selectedClass}
        setSelectedClass={setSelectedClass}
      />

      {/* Add Student */}
      <div className="card">
        <h2>➕ Add Student</h2>

        <input
          placeholder="Student Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          placeholder="Roll Number"
          value={rollNo}
          onChange={(e) => setRollNo(e.target.value)}
        />

        <button onClick={addStudent}>
          Add Student
        </button>
      </div>

      {/* Today's Attendance */}
      <div className="card">
        <h2>📅 Today's Attendance ({today})</h2>

        {students.map((student) => (
          <div
            key={student._id}
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "10px",
              alignItems: "center",
            }}
          >
            <span>
              {student.name} (Roll: {student.rollNo})
            </span>

            <div>
              <button
                style={{ background: "#28a745", color: "white", marginRight: "8px" }}
                onClick={() => markAttendance(student.rollNo, "Present")}
              >
                Present
              </button>

              <button
                style={{ background: "#dc3545", color: "white" }}
                onClick={() => markAttendance(student.rollNo, "Absent")}
              >
                Absent
              </button>
            </div>
          </div>
        ))}

        <button
          style={{ marginTop: "15px" }}
          onClick={viewAttendance}
        >
          View Today
        </button>

        <ul className="attendance-list">
          {attendance.map((a) => (
            <li key={a._id}>
              <strong>{a.student?.name}</strong> - {a.status}
            </li>
          ))}
        </ul>
      </div>

      {/* Class Summary */}
      <ClassSummary selectedClass={selectedClass} />

      {/* Student Summary */}
      <AttendanceSummary selectedClass={selectedClass} />

      {/* Complaint Section */}
      <ComplaintSection />
    </div>
  );
}

export default App;
