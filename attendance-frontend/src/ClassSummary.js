import React, { useState } from "react";
import axios from "axios";
import { API } from "./api";

function ClassSummary({ selectedClass }) {
  const [summary, setSummary] = useState(null);

  const fetchSummary = async () => {
    if (!selectedClass) return alert("Select class");

    const res = await axios.get(
      `${API}/api/attendance/class-summary/${selectedClass}`
    );

    setSummary(res.data);
  };

  return (
    <div className="card">
      <h2>📊 Class Summary</h2>

      <button onClick={fetchSummary}>View Summary</button>

      {summary && (
        <div style={{ marginTop: "15px" }}>
          <p>Total Lectures: {summary.total}</p>
          <p>Present: {summary.present}</p>
          <p>Absent: {summary.absent}</p>
          <p>Attendance %: {summary.percentage}%</p>
        </div>
      )}
    </div>
  );
}

export default ClassSummary;