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

    //find all completed course sof a student and the courses details
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

    // 2. Fetch completed courses for the student
    const completedCourseIDs = completedCourses.map((cc) => cc.courseID);

    let allCurriculumCourses;

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

    // 4. Calculate remaining courses by removing completed ones
    const remainingCourses = allCurriculumCourses.filter(
      (course) => !completedCourseIDs.includes(course.courseID)
    );

    // 5. Return completed and remaining courses
    return res.status(200).json({
      status: "success",
      data: {
        completedCourses: completedCourses.map((cc) => ({
          courseID: cc.courseID,
          courseName: cc.course.courseName,
          credits: cc.course.credits,
          nqf_level: cc.course.nqf_level,
        })),
        remainingCourses: remainingCourses.map((rc) => ({
          courseID: rc.courseID,
          courseName: rc.course.courseName,
          credits: rc.course.credits,
          nqfLevel: rc.course.nqf_level,
        })),
      },
    });
  } catch (error) {
    console.error("Error fetching course information:", error.message);
    return res.status(500).json({
      status: "fail",
      message: "Internal Server Error",
    });
  }
};

module.exports = {
  getCourseProgress,
};
