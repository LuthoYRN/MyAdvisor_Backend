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

// API to get all majors or programmes advised by the advisor
const getCurriculumsForAdvisor = async (req, res) => {
  try {
    const { advisorID } = req.params;

    // 1. Find the advisor's ID by UUID
    const advisorExists = await advisor.findOne({
      where: { uuid: advisorID },
      attributes: ["id"],
    });

    if (!advisorExists) {
      return res.status(404).json({
        status: "fail",
        message: "Advisor not found",
      });
    }

    const advisorInternalID = advisorExists.id;

    // 2. Check if advisor is linked to any majors
    const advisorMajors = await advisorMajor.findAll({
      where: { advisorID: advisorInternalID },
      include: [
        {
          model: major,
          attributes: ["majorName", "id"], // Get major name and ID
          include: [
            {
              model: department,
              attributes: ["facultyID"], // Get faculty ID from department
              include: [
                {
                  model: faculty,
                  attributes: ["facultyName"], // Get faculty name
                },
              ],
            },
          ],
        },
      ],
    });

    // 3. If advisor has majors, return only majors (no programmes)
    if (advisorMajors.length > 0) {
      const majors = advisorMajors.map((am) => ({
        curriculumID: am.major.id,
        curriculumName: am.major.majorName,
        facultyName: am.major.department.faculty.facultyName,
        type: "Major", // Type is Major
      }));

      return res.status(200).json({
        status: "success",
        data: majors,
      });
    }

    // 4. If no majors, check if advisor is linked to any programmes
    const advisorProgrammes = await advisorProgramme.findAll({
      where: { advisorID: advisorInternalID },
      include: [
        {
          model: programme,
          attributes: ["programmeName", "id"], // Get major name and ID
          include: [
            {
              model: department,
              attributes: ["facultyID"], // Get faculty ID from department
              include: [
                {
                  model: faculty,
                  attributes: ["facultyName"], // Get faculty name
                },
              ],
            },
          ],
        },
      ],
    });

    // 5. If advisor has programmes, return programmes
    if (advisorProgrammes.length > 0) {
      const programmes = advisorProgrammes.map((ap) => ({
        curriculumID: ap.programme.id,
        curriculumName: ap.programme.programmeName,
        facultyName: ap.programme.department.faculty.facultyName,
        type: "Programme", // Type is Programme
      }));

      return res.status(200).json({
        status: "success",
        data: programmes,
      });
    }

    // 6. If neither majors nor programmes are found
    return res.status(404).json({
      status: "fail",
      message: "Advisor does not advise on any majors or programmes.",
    });
  } catch (error) {
    console.error("Error fetching curriculums for advisor:", error.message);
    return res.status(500).json({
      status: "fail",
      message: "Internal Server Error",
    });
  }
};

// API to delete a curriculum (major or programme) for an advisor
const deleteAdvisorCurriculum = async (req, res) => {
  try {
    const { advisorID, currID } = req.params;

    // 1. Find the advisor's ID by UUID
    const advisorExists = await advisor.findOne({
      where: { uuid: advisorID },
      attributes: ["id"],
    });

    if (!advisorExists) {
      return res.status(404).json({
        status: "fail",
        message: "Advisor not found",
      });
    }

    const advisorInternalID = advisorExists.id;

    // 2. Check if the currID belongs to a major
    const majorExists = await major.findOne({ where: { id: currID } });

    if (majorExists) {
      // 3. If it belongs to a major, remove the association from advisorMajor
      const deletedMajor = await advisorMajor.destroy({
        where: { advisorID: advisorInternalID, majorID: currID },
      });

      if (deletedMajor) {
        return res.status(200).json({
          status: "success",
          message: "Major curriculum association removed successfully.",
        });
      } else {
        return res.status(404).json({
          status: "fail",
          message: "Association with this major not found for the advisor.",
        });
      }
    }

    // 4. If it's not a major, check if currID belongs to a programme
    const programmeExists = await programme.findOne({ where: { id: currID } });

    if (programmeExists) {
      // 5. If it belongs to a programme, remove the association from advisorProgramme
      const deletedProgramme = await advisorProgramme.destroy({
        where: { advisorID: advisorInternalID, programmeID: currID },
      });

      if (deletedProgramme) {
        return res.status(200).json({
          status: "success",
          message: "Programme curriculum association removed successfully.",
        });
      } else {
        return res.status(404).json({
          status: "fail",
          message: "Association with this programme not found for the advisor.",
        });
      }
    }

    // 6. If neither major nor programme is found
    return res.status(404).json({
      status: "fail",
      message: "Curriculum ID does not exist as a major or programme.",
    });
  } catch (error) {
    console.error("Error deleting curriculum for advisor:", error.message);
    return res.status(500).json({
      status: "fail",
      message: "Internal Server Error",
    });
  }
};

// API call to get all courses ordered by NQF level and semester for a curriculum
const getCoursesByCurriculum = async (req, res) => {
  try {
    const { currID } = req.params;

    let courses = [];

    // 1. Check if the currID belongs to a major
    const majorExists = await major.findOne({ where: { id: currID } });
    if (majorExists) {
      // 2. If it's a major, fetch the associated courses
      courses = await sharedCourse.findAll({
        where: { majorID: currID },
        include: [
          {
            model: course,
            attributes: ["courseName", "id", "credits", "nqf_level"],
          },
        ],
        order: [
          [sequelize.literal('"course"."nqf_level"'), "ASC"], // Order by NQF level first
          [
            sequelize.literal(
              `CASE 
              WHEN RIGHT("course"."id", 1) = 'F' THEN 1 
              WHEN RIGHT("course"."id", 1) = 'S' THEN 2 
              ELSE 3 
              END`
            ),
            "ASC",
          ], // F before S
        ],
      });
    } else {
      // 3. If it's not a major, check if currID belongs to a programme
      const programmeExists = await programme.findOne({
        where: { id: currID },
      });
      if (programmeExists) {
        // 4. Fetch the associated courses for the programme
        courses = await sharedCourse.findAll({
          where: { programmeID: currID },
          include: [
            {
              model: course,
              attributes: ["courseName", "id", "credits", "nqf_level"],
            },
          ],
          order: [
            [sequelize.literal('"course"."nqf_level"'), "ASC"], // Order by NQF level first
            [
              sequelize.literal(
                `CASE 
                WHEN RIGHT("course"."id", 1) = 'F' THEN 1 
                WHEN RIGHT("course"."id", 1) = 'S' THEN 2 
                ELSE 3 
                END`
              ),
              "ASC",
            ], // F before S
          ],
        });
      } else {
        // 5. If neither major nor programme is found, return an error
        return res.status(404).json({
          status: "fail",
          message: "Curriculum ID does not exist as a major or programme.",
        });
      }
    }

    // 6. Format the courses to return in the desired structure
    const formattedCourses = courses.map((sc) => ({
      id: sc.course.id,
      courseName: sc.course.courseName,
      credits: sc.course.credits,
      nqfLevel: sc.course.nqf_level,
    }));

    return res.status(200).json({
      status: "success",
      data: formattedCourses,
    });
  } catch (error) {
    console.error("Error fetching courses for curriculum:", error.message);
    return res.status(500).json({
      status: "fail",
      message: "Internal Server Error",
    });
  }
};

module.exports = {
  getCurriculumsForAdvisor,
  deleteAdvisorCurriculum,
  getCoursesByCurriculum,
};
