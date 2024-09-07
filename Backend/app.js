const express = require("express");
const app = express();
const authRouter = require("./routes/authRoute");
const studentRouter = require("./routes/studentRoute");
app.use(express.json());

app.use("/api/auth/", authRouter);
app.use("/api/student/",studentRouter);
module.exports = app;
