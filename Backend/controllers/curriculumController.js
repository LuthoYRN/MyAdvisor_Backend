const { ValidationError, Op } = require("sequelize");
const { sequelize } = require("../db/models");
const {
  advisor,
  faculty,
  availability,
  student,
  notification,
  uploadedFile,
  appointment,
  adviceLog,
  appointmentRequest,
  course,
  completedCourse,
  advisorMajor,
  major,
  department,
  sharedCourse,
  studentsMajor,
} = require("../db/models");

//API to get the advisor's dashboard
const getCurriculumsAdvised = async (req, res) => {
  try {
  } catch (error) {
    console.error("Erro:", error.message);
    return res.status(500).json({
      status: "fail",
      message: "Internal Server Error",
    });
  }
};
module.exports = {
  getCurriculumsAdvised,
};
