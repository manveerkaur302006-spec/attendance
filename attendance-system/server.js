// const express = require("express");
// const mongoose = require("mongoose");
// const cors = require("cors");
// require("dotenv").config();

// const app = express();

// // Middleware
// app.use(cors());
// app.use(express.json());

// // MongoDB Connection (LOCAL)
// mongoose.connect(process.env.MONGO_URI)
//   .then(() => console.log("MongoDB Connected"))
//   .catch((err) => console.log("DB Error:", err));

// // Test Route
// app.get("/", (req, res) => {
//   res.send("Attendance System Backend Running 🚀");
// });

// // Routes
// app.use("/api/students", require("./routes/studentRoutes"));
// app.use("/api/attendance", require("./routes/attendanceRoutes"));

// const PORT = process.env.PORT || 5000;

// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// Connect to Local MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/attendanceDB")
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

//   mongoose.connection.once("open", async () => {
//   try {
//     await mongoose.connection.dropCollection("students");
//     console.log("Old students collection deleted");
//   } catch (err) {
//     console.log("Collection not found (first time)");
//   }
// });

// mongoose.connection.once("open", async () => {
//   try {
//     await mongoose.connection.db.dropDatabase();
//     console.log("🔥 Entire Database Deleted Successfully");
//   } catch (err) {
//     console.log("Error deleting database:", err);
//   }
// });

// Routes
app.use("/api/students", require("./routes/studentRoutes"));
app.use("/api/attendance", require("./routes/attendanceRoutes"));
app.use("/api/complaints", require("./routes/complaintRoutes"));
app.use("/api/classes", require("./routes/classRoutes"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`); 
});