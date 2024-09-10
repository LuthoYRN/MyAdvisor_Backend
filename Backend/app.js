const express = require("express");
const app = express();
const authRouter = require("./routes/authRoute");
const studentRouter = require("./routes/studentRoute");
const advisorRouter = require("./routes/advisorRoute");
const path = require("path");
app.use(express.json());

app.use("/api/auth/", authRouter);
app.use("/api/student/", studentRouter);
app.use("/api/advisor/", advisorRouter);
app.use("/db/uploads", express.static(path.join(__dirname, "db/uploads")));
module.exports = app;
