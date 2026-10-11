import React, { useState } from "react";
import axios from "axios";
import { API } from "./api";

function ComplaintSection() {
  const [studentName, setStudentName] = useState("");
  const [message, setMessage] = useState("");
  const [complaints, setComplaints] = useState([]);

  const submitComplaint = async () => {
    await axios.post(`${API}/api/complaints`, {
      studentName,
      message
    });
    alert("Complaint Submitted");
    setStudentName("");
    setMessage("");
  };

  const fetchComplaints = async () => {
    const res = await axios.get(`${API}/api/complaints`);
    setComplaints(res.data);
  };

  const deleteComplaint = async (id) => {
    await axios.delete(`${API}/api/complaints/${id}`);
    fetchComplaints();
  };

  return (
    <div className="card">
      <h2>Student Complaints</h2>

      <input
        placeholder="Your Name"
        value={studentName}
        onChange={(e) => setStudentName(e.target.value)}
      />

      <textarea
        placeholder="Write your complaint..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        style={{
          width: "100%",
          padding: "10px",
          marginBottom: "12px",
          borderRadius: "8px",
          border: "1px solid #ccc"
        }}
      />

      <button onClick={submitComplaint}>Submit Complaint</button>
      <button
        onClick={fetchComplaints}
        style={{ marginTop: "10px", background: "#28a745" }}
      >
        Show All Complaints
      </button>

      <ul className="attendance-list">
        {complaints.map((c) => (
          <li key={c._id}>
            <strong>{c.studentName}</strong>: {c.message}
            <button
              style={{
                marginTop: "5px",
                background: "#dc3545"
              }}
              onClick={() => deleteComplaint(c._id)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ComplaintSection;