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

    // Retrieve all courses for prerequisite and equivalent options
    const allCourses = await course.findAll({
      attributes: ["id", "courseName", "credits", "nqf_level"], // Specify the fields you want to return
    });

    // If no courses are found
    if (!allCourses || allCourses.length === 0) {
      return res.status(404).json({
        status: "fail",
        message: "No courses found in the system",
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
        bothSemesters: courseDetails.bothSemesters,
        specialRequirement, // Object with condition and requirement or null
        allCourses, // Include all available courses
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

// API call to get all courses for prerequisite and equivalent searches
const getAllCourses = async (req, res) => {
  try {
    // Fetch all courses from the database
    const courses = await course.findAll({
      attributes: ["id", "courseName", "credits", "nqf_level"], // Specify the fields you want to return
    });

    // If no courses are found
    if (!courses || courses.length === 0) {
      return res.status(404).json({
        status: "fail",
        message: "No courses found in the system",
      });
    }

    // Return the list of courses
    return res.status(200).json({
      status: "success",
      data: courses,
    });
  } catch (error) {
    console.error("Error fetching all courses:", error.message);
    return res.status(500).json({
      status: "fail",
      message: "Internal Server Error",
    });
  }
};

//adding an existing course to the system
const addExisting = async (req, res) => {
  try {
    const { currID } = req.params;
    const { courseID, prerequisiteFor } = req.body; // Expecting course ID and an array of prerequisite IDs

    // 1. Check if the curriculum exists (major or programme)
    const curriculum = await sharedCourse.findOne({
      where: { [Op.or]: [{ majorID: currID }, { programmeID: currID }] },
    });

    if (!curriculum) {
      return res.status(404).json({
        status: "fail",
        message: "Curriculum not found.",
      });
    }

    // 2. Check if the course is already in the curriculum
    const existingCourse = await sharedCourse.findOne({
      where: {
        [Op.or]: [
          { majorID: curriculum.majorID, courseID },
          { programmeID: curriculum.programmeID, courseID },
        ],
      },
    });

    if (existingCourse) {
      return res.status(400).json({
        status: "fail",
        message: "Course is already part of the curriculum.",
      });
    }

    // 3. Add the course to sharedCourse
    await sharedCourse.create({
      majorID: curriculum.majorID || null, // Based on whether it's a major or programme
      programmeID: curriculum.programmeID || null,
      courseID: courseID,
    });

    // 4. Update prerequisites for each course in prerequisiteCourseIDs
    if (prerequisiteFor) {
      for (const updateID of prerequisiteFor) {
        const courseToUpdate = await course.findOne({
          where: { id: updateID },
        });
        if (courseToUpdate) {
          // Merge existing prerequisites with the new courseID and remove duplicates
          const existingPrerequisites = courseToUpdate.prerequisites || [];
          const updatedPrerequisites = [
            ...new Set([...existingPrerequisites, courseID]),
          ]; // Add new course as prerequisite

          await course.update(
            { prerequisites: updatedPrerequisites },
            { where: { id: updateID } }
          );
        }
      }
    }

    // 5. Send success response
    return res.status(201).json({
      status: "success",
      message: "Course added to the curriculum successfully.",
    });
  } catch (error) {
    console.error("Error adding course to curriculum:", error.message);
    return res.status(500).json({
      status: "fail",
      message: "Internal Server Error",
    });
  }
};

module.exports = {
  getAllCourses,
  getCourseForEditing,
  updateCourse,
  addExisting,
};
