const { ValidationError, Op } = require("sequelize");
const { sequelize } = require("../db/models");
const {
  advisor,
  faculty,
  programme,
  course,
  advisorMajor,
  advisorProgramme,
  major,
  sharedCourse,
  department,
} = require("../db/models");

// API call to get course information for editing
const getCourseForEditing = async (req, res) => {
  try {
    const { courseID } = req.params;

    // Find the course by its ID
    const courseDetails = await course.findOne({
      where: { id: courseID },
      attributes: [
        "id",
        "courseName",
        "credits",
        "nqf_level",
        "prerequisites",
        "bothSemesters",
        "equivalents",
        "specialRequirements",
      ],
    });

    if (!courseDetails) {
      return res.status(404).json({
        status: "fail",
        message: "Course not found",
      });
    }

    // Return course data with required information for editing
    return res.status(200).json({
      status: "success",
      data: {
        courseCode: courseDetails.id,
        courseName: courseDetails.courseName,
        credits: courseDetails.credits,
        nqfLevel: courseDetails.nqf_level,
        prerequisites: courseDetails.prerequisites, // Array of prerequisite IDs
        equivalents: courseDetails.equivalents, // Array of equivalent course IDs
        specialRequirements: courseDetails.specialRequirements, // Special requirements text
        bothSemesters: courseDetails.bothSemesters,
      },
    });
  } catch (error) {
    console.error("Error fetching course for editing:", error.message);
    return res.status(500).json({
      status: "fail",
      message: "Internal Server Error",
    });
  }
};

module.exports = { getCourseForEditing };
