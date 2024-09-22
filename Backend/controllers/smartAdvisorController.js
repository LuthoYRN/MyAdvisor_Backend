const { sequelize } = require("../db/models");
const { Op } = require("sequelize");

const {
  student,
  major,
  course,
  studentsMajor,
  completedCourse,
  sharedCourse,
  programme,
  department,
  faculty,
} = require("../db/models");

const getCourseProgress = async (req, res) => {
  try {
    const { studentID } = req.params;

    // 1. Fetch student information using UUID
    const theStudent = await student.findOne({ where: { uuid: studentID } });
    if (!theStudent) {
      return res.status(404).json({
        status: "fail",
        message: "Student not found.",
      });
    }

    // 2. Find all completed courses of the student and their details
    const completedCourses = await completedCourse.findAll({
      where: { studentID: theStudent.id },
      attributes: ["courseID"],
      include: [
        {
          model: course,
          attributes: ["id", "courseName", "credits", "nqf_level"],
        },
      ],
    });

    const completedCourseIDs = completedCourses.map((cc) => cc.courseID);

    let allCurriculumCourses = [];

    // 3. Check if the student has a programme
    if (theStudent.programmeID) {
      // Fetch all courses in the student's programme
      allCurriculumCourses = await sharedCourse.findAll({
        where: { programmeID: theStudent.programmeID },
        attributes: ["courseID"],
        include: [
          {
            model: course,
            attributes: ["id", "courseName", "credits", "nqf_level"],
          },
        ],
      });
    } else {
      // If no programme, fetch the student's majors
      const studentMajors = await studentsMajor.findAll({
        where: { studentID: theStudent.id },
        attributes: ["majorID"],
      });

      if (!studentMajors || studentMajors.length === 0) {
        return res.status(404).json({
          status: "fail",
          message: "No majors or programme found for this student.",
        });
      }

      const majorIDs = studentMajors.map((sm) => sm.majorID);

      // Fetch all courses in the student's majors
      allCurriculumCourses = await sharedCourse.findAll({
        where: { majorID: majorIDs },
        attributes: ["courseID"],
        include: [
          {
            model: course,
            attributes: ["id", "courseName", "credits", "nqf_level"],
          },
        ],
      });
    }

    // 4. Remove duplicates from the curriculum courses
    const uniqueCurriculumCourses = {};
    allCurriculumCourses.forEach((curriculum) => {
      if (!uniqueCurriculumCourses[curriculum.courseID]) {
        uniqueCurriculumCourses[curriculum.courseID] = curriculum.course;
      }
    });

    // 5. Calculate remaining courses by removing completed ones
    const remainingCourses = Object.values(uniqueCurriculumCourses).filter(
      (course) => !completedCourseIDs.includes(course.id)
    );

    // 6. Custom sorting logic by courseID and semester
    const customSort = (a, b) => {
      const aNum = parseInt(a.courseID.match(/\d+/)[0], 10); // Extract the first number from courseID
      const bNum = parseInt(b.courseID.match(/\d+/)[0], 10);

      // Compare course numbers
      if (aNum !== bNum) {
        return aNum - bNum;
      }

      // If the course numbers are the same, sort by semester (F before S)
      const aSemester = a.courseID.slice(-1); // Last character of courseID (F or S)
      const bSemester = b.courseID.slice(-1);

      return aSemester.localeCompare(bSemester);
    };

    // 7. Sort completed and remaining courses using the custom sort function
    const sortedCompletedCourses = completedCourses
      .map((cc) => ({
        courseID: cc.courseID,
        courseName: cc.course.courseName,
        credits: cc.course.credits,
        nqf_level: cc.course.nqf_level,
      }))
      .sort(customSort);

    const sortedRemainingCourses = remainingCourses
      .map((rc) => ({
        courseID: rc.id,
        courseName: rc.courseName,
        credits: rc.credits,
        nqfLevel: rc.nqf_level,
      }))
      .sort(customSort);

    // 8. Return completed and remaining courses
    return res.status(200).json({
      status: "success",
      data: {
        completedCourses: sortedCompletedCourses,
        remainingCourses: sortedRemainingCourses,
      },
    });
  } catch (error) {
    console.error("Error fetching course progress:", error.message);
    return res.status(500).json({
      status: "fail",
      message: "Internal Server Error",
    });
  }
};

const getEquivalents = async (req, res) => {
  try {
    const { courseID } = req.params;

    // Convert courseID to uppercase
    const formattedCourseID = courseID.toUpperCase();

    // Find the course by ID and check if it has equivalents
    const theCourse = await course.findOne({
      where: { id: formattedCourseID },
      attributes: ["id", "courseName", "equivalents"],
    });

    if (!theCourse) {
      return res.status(404).json({
        status: "fail",
        message: `Course ${formattedCourseID} not found.`,
      });
    }

    // Check if the course has any equivalents
    if (!theCourse.equivalents || theCourse.equivalents.length === 0) {
      return res.status(200).json({
        status: "success",
        data: [],
        message: `No equivalent courses found for ${formattedCourseID}.`,
      });
    }

    // Fetch all equivalent courses by their IDs
    const equivalentCourses = await course.findAll({
      where: {
        id: {
          [Op.in]: theCourse.equivalents,
        },
      },
      attributes: ["id", "courseName", "credits", "nqf_level"],
    });

    if (equivalentCourses.length === 0) {
      return res.status(200).json({
        status: "success",
        data: [],
        message: `No equivalent courses found for ${formattedCourseID}.`,
      });
    }

    // Format equivalent course details
    const equivalentsList = equivalentCourses.map((course) => `${course.id}`);

    // Check the length of equivalentsList and format the message accordingly
    const equivalentMessage =
      equivalentsList.length > 1
        ? `The equivalents for ${formattedCourseID} are ${equivalentsList.join(
            ", "
          )}.`
        : `The equivalent for ${formattedCourseID} is ${equivalentsList.join(
            ", "
          )}.`;

    // Return the equivalent courses
    return res.status(200).json({
      status: "success",
      message: equivalentMessage,
    });
  } catch (error) {
    console.error("Error fetching equivalents:", error.message);
    return res.status(500).json({
      status: "fail",
      message: "Internal Server Error",
    });
  }
};

const getCoursePrerequisitesAndRequirements = async (req, res) => {
  try {
    let { courseID } = req.params;

    // Find the course by ID
    const theCourse = await course.findOne({
      where: { id: courseID.toUpperCase() },
      attributes: ["id", "courseName", "prerequisites", "specialRequirements"],
    });

    if (!theCourse) {
      return res.status(404).json({
        status: "fail",
        message: "Course not found.",
      });
    }
    courseID = theCourse.id;
    const { prerequisites, specialRequirements } = theCourse;
    // Helper function to format prerequisite list
    const formatPrerequisites = (prereqs) => prereqs.join(", ");

    // Helper function to decide whether to use "is" or "are"
    const prerequisiteVerb = (prereqs) => (prereqs.length === 1 ? "is" : "are");

    // Case 1: No prerequisites but special requirements with [CX]
    if (
      !prerequisites &&
      specialRequirements &&
      specialRequirements.startsWith("[CX]")
    ) {
      return res.status(200).json({
        status: "success",
        message: `The prerequisite of ${courseID} is ${specialRequirements
          .replace("[CX]", "")
          .trim()}.`,
      });
    }

    // Case 2: No prerequisites and no special requirements
    if (!prerequisites && !specialRequirements) {
      return res.status(200).json({
        status: "success",
        message: `The course ${courseID} has no prerequisites.`,
      });
    }

    // Case 3: Has prerequisites but no special requirements
    if (prerequisites && !specialRequirements) {
      return res.status(200).json({
        status: "success",
        message: `The prerequisite${
          prerequisites.length === 1 ? "" : "s"
        } of ${courseID} ${prerequisiteVerb(
          prerequisites
        )} ${formatPrerequisites(prerequisites)}.`,
      });
    }

    // Case 4: Has both prerequisites and special requirements
    if (prerequisites && specialRequirements) {
      if (specialRequirements.startsWith("[AND]")) {
        return res.status(200).json({
          status: "success",
          message: `The prerequisite${
            prerequisites.length === 1 ? "" : "s"
          } of ${courseID} ${prerequisiteVerb(
            prerequisites
          )} ${formatPrerequisites(prerequisites)} and ${specialRequirements
            .replace("[AND]", "")
            .trim()}.`,
        });
      } else if (specialRequirements.startsWith("[OR]")) {
        return res.status(200).json({
          status: "success",
          message: `The prerequisite${
            prerequisites.length === 1 ? "" : "s"
          } of ${courseID} ${prerequisiteVerb(
            prerequisites
          )} ${formatPrerequisites(prerequisites)} or ${specialRequirements
            .replace("[OR]", "")
            .trim()}.`,
        });
      }
    }

    // Default fallback (if no specific conditions match)
    return res.status(200).json({
      status: "success",
      message: `The prerequisite${
        prerequisites.length === 1 ? "" : "s"
      } of ${courseID} ${prerequisiteVerb(prerequisites)} ${formatPrerequisites(
        prerequisites
      )}.`,
    });
  } catch (error) {
    console.error(
      "Error fetching course prerequisites and requirements:",
      error.message
    );
    return res.status(500).json({
      status: "fail",
      message: "Internal Server Error",
    });
  }
};

module.exports = {
  getCourseProgress,
  getCoursePrerequisitesAndRequirements,
  getEquivalents,
};
