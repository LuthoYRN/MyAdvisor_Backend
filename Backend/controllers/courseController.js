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
        "courseCode",
        "credits",
        "nqf_level",
        "prerequisites",
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

// API call to get all courses in the system
const getAllCourses = async (req, res) => {
  try {
    // Find all courses in the system
    const allCourses = await course.findAll({
      attributes: ["id", "courseName", "credits", "nqf_level"],
      order: [
        [sequelize.literal('SUBSTRING("id", 1, 1)'), "ASC"], // Order by first digit in ID (course code)
        [sequelize.literal(`SUBSTRING("id", LENGTH("id"), 1)`), "ASC"], // Order F before S before Z
      ],
    });

    // If no courses are found
    if (!allCourses || allCourses.length === 0) {
      return res.status(404).json({
        status: "fail",
        message: "No courses found in the system",
      });
    }

    // Return the list of all courses
    return res.status(200).json({
      status: "success",
      data: allCourses,
    });
  } catch (error) {
    console.error("Error fetching all courses:", error.message);
    return res.status(500).json({
      status: "fail",
      message: "Internal Server Error",
    });
  }
};

module.exports = { getAllCourses, getCourseForEditing };
