const { ValidationError, Op } = require("sequelize");
const { sequelize } = require("../db/models");
const bcrypt = require("bcrypt");
const {
  advisor,
  student,
  facultyAdmin,
  faculty,
  advisorCluster,
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
      attributes: ["id", "name", "surname", "email"],
      raw: true,
    });

    // Add permission field for students
    const studentUsers = students.map((student) => ({
      id: student.id,
      name: `${student.name} ${student.surname}`,
      email: student.email,
      permission: "student", // Permission for students
    }));

    // Find all advisors and include their advisor_level
    const advisors = await advisor.findAll({
      attributes: ["id", "name", "surname", "email", "advisor_level"],
      raw: true,
    });

    // Add permission field for advisors based on their advisor_level
    const advisorUsers = advisors.map((advisor) => ({
      id: advisor.id,
      name: `${advisor.name} ${advisor.surname}`,
      email: advisor.email,
      permission:
        advisor.advisor_level === "senior" ? "Senior Advisor" : "Advisor", // Set based on advisor_level
    }));

    // Find all faculty admins
    const facultyAdmins = await facultyAdmin.findAll({
      attributes: ["id", "name", "surname", "email"],
      raw: true,
    });

    // Add permission field for faculty admins
    const facultyAdminUsers = facultyAdmins.map((admin) => ({
      id: admin.id,
      name: `${admin.name} ${admin.surname}`,
      email: admin.email,
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

const getCluster = async (req, res) => {
  try {
    const { facultyID } = req.params;
    // Fetch advisors in the same faculty who have a null clusterID
    const eligibleAdvisors = await advisor.findAll({
      where: {
        facultyID,
        advisor_level: "advisor",
        clusterID: null, // Only include advisors without a cluster
      },
      attributes: ["id", "name", "surname", "email"], // Adjust attributes as needed
    });

    return res.status(200).json({
      status: "success",
      data: eligibleAdvisors,
    });
  } catch (error) {
    console.error("Error fetching advisors for cluster add:", error.message);
    return res.status(500).json({
      status: "fail",
      message: "Internal Server Error",
    });
  }
};

const getSeniors = async (req, res) => {
  try {
    const { facultyID } = req.params;
    const seniors = await advisor.findAll({
      where: {
        facultyID,
        advisor_level: "senior",
      },
      attributes: ["id", "name", "surname", "email"],
    });
    return res.status(200).json({
      status: "success",
      data: seniors,
    });
  } catch (error) {
    console.error("Error fetching seniors for faculty:", error.message);
    return res.status(500).json({
      status: "fail",
      message: "Internal Server Error",
    });
  }
};

//write code to add a faculty admin
const addAdmin = async (req, res) => {
  try {
    const { name, surname, email, facultyID } = req.body;

    // Ensure all required fields are provided
    if (!name || !surname || !email || !facultyID) {
      return res.status(400).json({
        status: "fail",
        message:
          "Please provide all required fields (name, surname, email, faculty).",
      });
    }

    // Check if an admin already exists with the provided email
    const existingAdmin = await facultyAdmin.findOne({ where: { email } });
    if (existingAdmin) {
      return res.status(409).json({
        status: "fail",
        message: "Email is already in use by another admin.",
      });
    }

    // Hash the password before storing it
    const hashedPassword = await bcrypt.hash("hashedpassword", 10);

    // Create a new admin
    const newAdmin = await facultyAdmin.create({
      name,
      surname,
      email,
      password: hashedPassword,
      profile_url:
        "https://pub-cfb4608b525a41058b2c8e0e2b138eea.r2.dev/default.png",
      facultyID,
    });

    // Return success response
    return res.status(201).json({
      status: "success",
      message: "Admin added successfully.",
      data: newAdmin,
    });
  } catch (error) {
    if (error.name === "SequelizeValidationError") {
      // Handle validation errors
      const validationErrors = error.errors.map((err) => err.message);
      return res.status(400).json({
        status: "fail",
        message: validationErrors,
      });
    }

    console.error("Error adding admin:", error.message);
    return res.status(500).json({
      status: "fail",
      message: "Internal Server Error",
    });
  }
};

const addAdvisor = async (req, res) => {
  try {
    const {
      name,
      surname,
      email,
      office,
      advisor_level, // "senior" or "advisor"
      facultyID,
      curriculums, // Array of major or programme IDs
      seniorAdvisorID = null, // Optional, Passed when adding a junior advisor
      cluster = [], // Passed when adding a senior advisor with a list of advisor IDs
    } = req.body;

    // Validate required fields
    if (
      !name ||
      !surname ||
      !email ||
      !office ||
      !advisor_level ||
      !curriculums ||
      !facultyID
    ) {
      return res.status(400).json({
        status: "fail",
        message: "All required fields must be provided.",
      });
    }

    // Check if email is already in use
    const existingAdvisor = await advisor.findOne({ where: { email } });
    if (existingAdvisor) {
      return res.status(409).json({
        status: "fail",
        message: "Email is already in use by another advisor.",
      });
    }

    // Hash the password before saving (assuming a default password for now)
    const hashedPassword = await bcrypt.hash("hashedpassword", 10);

    let clusterID = null; // For cluster assignment later

    // Create the new advisor
    const newAdvisor = await advisor.create({
      name,
      surname,
      email,
      password: hashedPassword,
      office,
      profile_url:
        "https://pub-cfb4608b525a41058b2c8e0e2b138eea.r2.dev/default.png",
      advisor_level,
      facultyID,
      clusterID: advisor_level === "advisor" ? clusterID : null, // Assign clusterID for junior advisors
    });

    // If adding a junior advisor (advisor_level === "advisor")
    if (advisor_level === "advisor") {
      // If seniorAdvisorID is provided, assign the junior advisor to the senior's cluster
      if (seniorAdvisorID) {
        // Find the senior advisor to retrieve the clusterID
        const seniorAdvisor = await advisor.findOne({
          where: { id: seniorAdvisorID },
        });

        if (!seniorAdvisor) {
          return res.status(404).json({
            status: "fail",
            message: "Senior advisor not found.",
          });
        }

        clusterID = seniorAdvisor.clusterID; // Assign the junior advisor to this cluster

        // Add the junior advisor to the existing cluster
        await advisorCluster.update(
          {
            advisorIDs: sequelize.fn(
              "array_append",
              sequelize.col("advisorIDs"),
              newAdvisor.id
            ),
          },
          { where: { seniorAdvisorID: seniorAdvisorID } }
        );

        // Update the new junior advisor with the clusterID
        await newAdvisor.update({ clusterID: clusterID });
      }
    }

    // If adding a senior advisor (advisor_level === "senior"), create a new cluster with an empty array
    if (advisor_level === "senior") {
      const newCluster = await advisorCluster.create({
        seniorAdvisorID: newAdvisor.id,
        advisorIDs: [], // Start with an empty advisorIDs array
      });

      // Update the new senior advisor with the new cluster ID
      await newAdvisor.update({ clusterID: newCluster.id });

      // If the cluster array is provided, assign the junior advisors to the cluster
      if (cluster.length > 0) {
        for (const juniorAdvisorID of cluster) {
          await advisorCluster.update(
            {
              advisorIDs: sequelize.fn(
                "array_append",
                sequelize.col("advisorIDs"),
                juniorAdvisorID // Append one value at a time
              ),
            },
            { where: { seniorAdvisorID: newAdvisor.id } }
          );

          // Also, update all the junior advisors' clusterID
          await advisor.update(
            { clusterID: newCluster.id },
            { where: { id: juniorAdvisorID } }
          );
        }
      }
    }

    // Find the faculty to check the curriculumType
    const facultySearch = await faculty.findOne({
      where: { id: facultyID },
      attributes: ["curriculumType"],
    });

    // Depending on the curriculumType (Major or Programme), add the advisor to the appropriate table
    const curriculumType = facultySearch.curriculumType;

    if (curriculumType === "Major") {
      // Add advisor to advisorMajor table
      for (const curriculumID of curriculums) {
        await advisorMajor.create({
          advisorID: newAdvisor.id,
          majorID: curriculumID,
        });
      }
    } else if (curriculumType === "Programme") {
      // Add advisor to advisorProgramme table
      for (const curriculumID of curriculums) {
        await advisorProgramme.create({
          advisorID: newAdvisor.id,
          programmeID: curriculumID,
        });
      }
    }

    return res.status(201).json({
      status: "success",
      message: `Advisor added successfully.`,
      data: newAdvisor,
    });
  } catch (error) {
    if (error.name === "SequelizeValidationError") {
      // Handle validation errors from the model
      const validationErrors = error.errors.map((err) => err.message);
      return res.status(400).json({
        status: "fail",
        message: validationErrors,
      });
    }

    console.error("Error adding advisor:", error.message);
    return res.status(500).json({
      status: "fail",
      message: "Internal Server Error",
    });
  }
};

module.exports = {
  addAdmin,
  addAdvisor,
  getAllUsersForAdmin,
  getCluster,
  getSeniors,
};
