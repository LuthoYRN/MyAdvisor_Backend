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

    // Determine the special requirement type and extract the text without the brackets
    let specialRequirement = null;

    if (courseDetails.specialRequirements) {
      let condition = null;
      let requirement = courseDetails.specialRequirements;

      if (requirement.includes("[CX]")) {
        condition = "Complex"; // Complex condition
        requirement = requirement.replace("[CX]", "").trim(); // Remove [CX]
      } else if (requirement.includes("[AND]")) {
        condition = "AND"; // Logical AND
        requirement = requirement.replace("[AND]", "").trim(); // Remove [AND]
      } else if (requirement.includes("[OR]")) {
        condition = "OR"; // Logical OR
        requirement = requirement.replace("[OR]", "").trim(); // Remove [OR]
      }

      // If there's a condition, set the specialRequirement object
      if (condition) {
        specialRequirement = {
          condition, // CX, AND, or OR
          requirement, // The actual requirement text
        };
      }
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
        bothSemesters: courseDetails.bothSemesters,
        specialRequirement, // Object with condition and requirement or null
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

// API call to update course information
const updateCourse = async (req, res) => {
  try {
    const { courseID } = req.params;
    const {
      courseName,
      credits,
      nqfLevel,
      prerequisites,
      equivalents,
      bothSemesters,
      specialRequirement,
    } = req.body;

    // Find the course by ID
    const courseExists = await course.findOne({ where: { id: courseID } });

    if (!courseExists) {
      return res.status(404).json({
        status: "fail",
        message: "Course not found",
      });
    }

    // Update the special requirements if present
    let specialRequirements = null;
    if (
      specialRequirement &&
      specialRequirement.condition &&
      specialRequirement.requirement
    ) {
      specialRequirements = `[${specialRequirement.condition}] ${specialRequirement.requirement}`;
    }

    // Update the course in the database
    await course.update(
      {
        courseName,
        credits,
        nqf_level: nqfLevel,
        prerequisites,
        equivalents,
        bothSemesters,
        specialRequirements,
      },
      {
        where: { id: courseID },
      }
    );

    return res.status(200).json({
      status: "success",
      message: "Course updated successfully",
    });
  } catch (error) {
    console.error("Error updating course:", error.message);
    return res.status(500).json({
      status: "fail",
      message: "Internal Server Error",
    });
  }
};

module.exports = { getCourseForEditing, updateCourse };
