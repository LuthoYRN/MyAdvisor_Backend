const { ValidationError, Op } = require("sequelize");
const { sequelize } = require("../db/models");
const {
  advisor,
  student,
  facultyAdmin,
  faculty,
  programme,
  course,
  advisorMajor,
  advisorProgramme,
  major,
  sharedCourse,
  department,
} = require("../db/models");

// API to get all users and their types (permissions) for the system admin, including counts
const getAllUsersForAdmin = async (req, res) => {
  try {
    // Find all students
    const students = await student.findAll({
      attributes: ["id", "name", "surname", "password", "email"],
      raw: true,
    });

    // Add permission field for students
    const studentUsers = students.map((student) => ({
      id: student.id,
      name: `${student.name} ${student.surname}`,
      email: student.email,
      password: student.password,
      permission: "student", // Permission for students
    }));

    // Find all advisors and include their advisor_level
    const advisors = await advisor.findAll({
      attributes: [
        "id",
        "name",
        "surname",
        "email",
        "password",
        "advisor_level",
      ],
      raw: true,
    });

    // Add permission field for advisors based on their advisor_level
    const advisorUsers = advisors.map((advisor) => ({
      id: advisor.id,
      name: `${advisor.name} ${advisor.surname}`,
      email: advisor.email,
      password: advisor.password,
      permission:
        advisor.advisor_level === "senior" ? "Senior Advisor" : "Advisor", // Set based on advisor_level
    }));

    // Find all faculty admins
    const facultyAdmins = await facultyAdmin.findAll({
      attributes: ["id", "name", "surname", "password", "email"],
      raw: true,
    });

    // Add permission field for faculty admins
    const facultyAdminUsers = facultyAdmins.map((admin) => ({
      id: admin.id,
      name: `${admin.name} ${admin.surname}`,
      email: admin.email,
      password: admin.password,
      permission: "facultyAdmin", // Permission for faculty admins
    }));

    // Combine all user types into one array
    const allUsers = [...studentUsers, ...advisorUsers, ...facultyAdminUsers];

    // Calculate counts of each type
    const studentCount = studentUsers.length;
    const advisorCount = advisorUsers.length;
    const facultyAdminCount = facultyAdminUsers.length;

    // Return the list of all users and the counts
    return res.status(200).json({
      status: "success",
      counts: {
        students: studentCount,
        advisors: advisorCount,
        facultyAdmins: facultyAdminCount,
      },
      data: allUsers,
    });
  } catch (error) {
    console.error("Error fetching all users for admin:", error.message);
    return res.status(500).json({
      status: "fail",
      message: "Internal Server Error",
    });
  }
};

module.exports = { getAllUsersForAdmin };
