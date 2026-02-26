import React, { useEffect, useState } from "react";
import axios from "axios";

const API = "http://localhost:5000";

function ClassSection({ selectedClass, setSelectedClass }) {
  const [classes, setClasses] = useState([]);
  const [className, setClassName] = useState("");

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    const res = await axios.get(`${API}/api/classes`);
    setClasses(res.data);
  };

  const addClass = async () => {
    if (!className) return alert("Enter class name");

    await axios.post(`${API}/api/classes`, { className });
    setClassName("");
    fetchClasses();
  };

  return (
    <div className="card">
      <h2>🏫 Manage Classes</h2>

      <input
        placeholder="New Class Name"
        value={className}
        onChange={(e) => setClassName(e.target.value)}
      />

      <button onClick={addClass}>Add Class</button>

      <h3 style={{ marginTop: "15px" }}>Select Class</h3>

      <select
        value={selectedClass}
        onChange={(e) => setSelectedClass(e.target.value)}
        style={{ width: "100%", padding: "10px", borderRadius: "10px" }}
      >
        <option value="">-- Select Class --</option>
        {classes.map((c) => (
          <option key={c._id} value={c._id}>
            {c.className}
          </option>
        ))}
      </select>
    </div>
  );
}

export default ClassSection;