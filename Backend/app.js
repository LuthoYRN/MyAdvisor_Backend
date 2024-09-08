const express = require("express");
const app = express();
const authRouter = require("./routes/authRoute");
const studentRouter = require("./routes/studentRoute");
const advisorRouter = require("./routes/advisorRoute");
app.use(express.json());

app.use("/api/auth/", authRouter);
app.use("/api/student/", studentRouter);
app.use("/api/advisor/", advisorRouter);
module.exports = app;
