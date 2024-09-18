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

// API call to get all courses by a specific faculty ID
const getAllCoursesByFacultyID = async (req, res) => {
  try {
    const { facultyID } = req.params;

    // Find all courses that belong to the faculty
    const courses = await course.findAll({
      attributes: ["id", "courseName", "credits", "nqf_level"], // Only course-related attributes
      where: { facultyID }, // Filter by faculty ID
      order: [
        [sequelize.literal('SUBSTRING("id", 4, 1)'), "ASC"], // Order by first digit in course ID
        [sequelize.literal(`SUBSTRING("id", LENGTH("id"), 1)`), "ASC"], // Order F before S before Z
      ],
    });

    // If no courses are found for the faculty
    if (!courses || courses.length === 0) {
      return res.status(404).json({
        status: "fail",
        message: "No courses found for this faculty",
      });
    }

    // Return only the course details
    return res.status(200).json({
      status: "success",
      data: courses, // Directly return the list of courses
    });
  } catch (error) {
    console.error("Error fetching courses by faculty ID:", error.message);
    return res.status(500).json({
      status: "fail",
      message: "Internal Server Error",
    });
  }
};

module.exports = {
  getAllCoursesByFacultyID,
};
