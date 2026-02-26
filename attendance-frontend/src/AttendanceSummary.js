// import React, { useState } from "react";
// import axios from "axios";

// const API = "http://localhost:5000";

// function AttendanceSummary() {
//   const [rollNo, setRollNo] = useState("");
//   const [summary, setSummary] = useState(null);

//   const fetchSummary = async () => {
//     if (!rollNo) {
//       alert("Enter Roll Number 💖");
//       return;
//     }

//     const res = await axios.get(
//       `${API}/api/attendance/summary/${rollNo}`
//     );

//     setSummary(res.data);
//   };

//   return (
//     <div className="card">
//       <h2>📊 Check Attendance Summary</h2>

//       <input
//         placeholder="Enter Roll Number"
//         value={rollNo}
//         onChange={(e) => setRollNo(e.target.value)}
//       />

//       <button
//         style={{ background: "#ff69b4", color: "white" }}
//         onClick={fetchSummary}
//       >
//         View Summary 💫
//       </button>

//       {summary && (
//         <div style={{ marginTop: "15px" }}>
//           <p>📚 Total Lectures: {summary.totalLectures}</p>
//           <p>✅ Present: {summary.presentLectures}</p>
//           <p>❌ Absent: {summary.absentLectures}</p>
//           <p>💖 Attendance %: {summary.percentage}%</p>
//         </div>
//       )}
//     </div>
//   );
// }

// export default AttendanceSummary;

import React, { useState } from "react";
import axios from "axios";

const API = "http://localhost:5000";

function AttendanceSummary({ selectedClass }) {
  const [rollNo, setRollNo] = useState("");
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState("");

  const fetchSummary = async () => {
    setError("");
    setSummary(null);

    if (!selectedClass) {
      return setError("Please select a class first");
    }

    if (!rollNo) {
      return setError("Please enter roll number");
    }

    try {
      const res = await axios.get(
        `${API}/api/attendance/student-summary/${selectedClass}/${rollNo}`
      );

      setSummary(res.data);
    } catch (err) {
      if (err.response && err.response.status === 404) {
        setError("Student not found in this class");
      } else {
        setError("Something went wrong");
      }
      console.log(err);
    }
  };

  return (
    <div className="card">
      <h2>📊 Student Attendance Summary</h2>

      <input
        type="text"
        placeholder="Enter Roll Number"
        value={rollNo}
        onChange={(e) => setRollNo(e.target.value)}
      />

      <button
        style={{ marginTop: "10px" }}
        onClick={fetchSummary}
      >
        View Summary
      </button>

      {error && (
        <p style={{ color: "red", marginTop: "10px" }}>
          {error}
        </p>
      )}

      {summary && (
        <div
          style={{
            marginTop: "15px",
            background: "#f4f6ff",
            padding: "15px",
            borderRadius: "10px",
          }}
        >
          <p><strong>Total Lectures:</strong> {summary.total}</p>
          <p><strong>Present:</strong> {summary.present}</p>
          <p><strong>Absent:</strong> {summary.absent}</p>
          <p><strong>Attendance %:</strong> {summary.percentage}%</p>
        </div>
      )}
    </div>
  );
}

export default AttendanceSummary;