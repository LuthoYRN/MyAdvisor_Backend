const { ValidationError } = require("sequelize");
const { sequelize } = require("../db/models");
const {
  advisor,
  faculty,
  student,
  course,
  completedCourse,
  major,
  advisorMajor,
  department,
  sharedCourse,
  studentsMajor,
} = require("../db/models");

const getAdvisorsForStudent = async (req, res) => {
    try {
      const { studentID } = req.params;
  
      // Find the student by UUID
      const the_student = await student.findOne({ where: { uuid: studentID } });
      if (!the_student) {
        return res
          .status(404)
          .json({ status: "fail", message: "Student not found" });
      }
  
      // Find the majors of the student
      const studentMajors = await studentsMajor.findAll({
        where: { studentID: the_student.id },
        attributes: ["majorID"],
      });
  
      if (!studentMajors || studentMajors.length === 0) {
        // Search under advisor programmes table (implementation needed here)
        return res.status(404).json({
          status: "fail",
          message: "No majors found for this student",
        });
      }
  
      // Get the list of major IDs
      const majorIDs = studentMajors.map((studentMajor) => studentMajor.majorID);
  
      // Find advisors associated with those majors and their advised majors
      const advisors = await advisorMajor.findAll({
        where: { majorID: majorIDs },
        attributes: [],
        include: [
          {
            model: advisor,
            attributes: ["uuid", "name", "surname", "office", "profile_url"],
          },
          {
            model: major, // Fetch associated majors
            attributes: ["majorName"],
          },
        ],
      });
  
      // If no advisors are found
      if (!advisors || advisors.length === 0) {
        return res.status(404).json({
          status: "fail",
          message: "No advisors found for the student's majors",
        });
      }
  
      // Use a map to group advisors by their UUID and collect their majors
      const advisorMap = {};
  
      advisors.forEach((am) => {
        const advisorID = am.advisor.uuid;
  
        // If the advisor is already in the map, push the new major to the majors array
        if (advisorMap[advisorID]) {
          advisorMap[advisorID].majors.push(am.major.majorName);
        } else {
          // Otherwise, initialize the advisor entry with their details and majors array
          advisorMap[advisorID] = {
            uuid: am.advisor.uuid,
            name: `${am.advisor.name} ${am.advisor.surname}`,
            office: am.advisor.office,
            profile_url: am.advisor.profile_url,
            majors: [am.major.majorName], // Initialize majors as an array
          };
        }
      });
  
      // Convert the advisorMap object back into an array
      const advisorList = Object.values(advisorMap);
  
      // Return the advisors in the desired format
      return res.status(200).json({
        status: "success",
        data: advisorList,
      });
    } catch (error) {
      console.error("Error fetching advisors for student:", error.message);
      return res.status(500).json({
        status: "fail",
        message: "Internal Server Error",
      });
    }
  };  

module.exports = { getAdvisorsForStudent };
