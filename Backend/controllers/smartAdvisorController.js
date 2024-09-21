const { sequelize } = require("../db/models");

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

module.exports = {
  getCourseProgress,
};
