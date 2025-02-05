const express = require("express");
const app = express();
const authRouter = require("./routes/authRoute");
const studentRouter = require("./routes/studentRoute");
const advisorRouter = require("./routes/advisorRoute");
const curriculumRouter = require("./routes/curriculumRoute");
const courseRouter = require("./routes/courseRoute");
const facultyAdminRouter = require("./routes/facultyAdminRoute");
const sysAdminRouter = require("./routes/sysAdminRoute");
const smartAdvisorRouter = require("./routes/smartAdvisorRoute");
const path = require("path");
const cors = require("cors");
app.use(express.json());
app.use(cors());
app.use("/api/auth/", authRouter);
app.use("/api/student/", studentRouter);
app.use("/api/advisor/", advisorRouter);
app.use("/api/curriculum/", curriculumRouter);
app.use("/api/courses/", courseRouter);
app.use("/api/facultyAdmin/", facultyAdminRouter);
app.use("/api/sysAdmin/", sysAdminRouter);
app.use("/api/smartAdvisor/",smartAdvisorRouter);
module.exports = app;
