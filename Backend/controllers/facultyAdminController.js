const { ValidationError, Op } = require("sequelize");
const { sequelize } = require("../db/models");
const { uploadToS3, deleteFromS3 } = require("../utils/s3"); // Import S3 utility functions
const path = require("path");
const fs = require("fs");
const {
  advisor,
  faculty,
  facultyAdmin,
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

// Controller function to get faculty admin's information
const getFacultyAdminDashboard = async (req, res) => {
  try {
    const { adminID } = req.params;

    // 1. Find the faculty admin by UUID (assuming UUID is used for admin identification)
    const Admin = await facultyAdmin.findOne({
      where: { uuid: adminID },
      attributes: ["uuid", "name", "surname", "profile_url", "facultyID"], // Fetch relevant fields
      include: {
        model: faculty,
        attributes: ["id", "facultyName"], // Include facultyName from faculty
      },
    });

    // 2. If faculty admin is not found, return a 404 error
    if (!Admin) {
      return res.status(404).json({
        status: "fail",
        message: "Faculty admin not found",
      });
    }

    // 3. Format the response
    return res.status(200).json({
      status: "success",
      data: {
        name: `${Admin.name} ${Admin.surname}`,
        profile_url: Admin.profile_url,
        facultyName: Admin.faculty.facultyName,
        facultyID: Admin.faculty.id,
      },
    });
  } catch (error) {
    console.error("Error fetching faculty admin info:", error.message);
    return res.status(500).json({
      status: "fail",
      message: "Internal Server Error",
    });
  }
};

const updateProfilePicture = async (req, res) => {
  try {
    const { adminID } = req.params;

    // Find the advisor record to get the existing profile picture
    const the_admin = await facultyAdmin.findOne({ where: { uuid: adminID } });
    if (!the_admin) {
      return res
        .status(404)
        .json({ status: "error", message: "Admin not found" });
    }

    // If there's an existing profile picture that's not the default, delete it
    const currentProfilePicture = the_admin.profile_url;
    const isDefaultPicture =
      currentProfilePicture ===
      "https://pub-cfb4608b525a41058b2c8e0e2b138eea.r2.dev/default.png";

    // If there's an existing profile picture that's not the default, delete it
    if (currentProfilePicture && !isDefaultPicture) {
      // Extract the key (file name) from the current profile picture URL
      const currentProfilePictureKey = currentProfilePicture.split(".dev/")[1];
      await deleteFromS3(currentProfilePictureKey); // Delete the file from S3
    }
    if (req.file) {
      const fileBuffer = req.file.buffer; // Get file buffer from multer
      const fileName = `profile-pictures/${Date.now()}_${
        req.file.originalname
      }`;
      const mimeType = req.file.mimetype;
      // Upload the new profile picture to S3
      const profilePictureUrl = await uploadToS3(
        fileBuffer,
        fileName,
        mimeType
      );
      // Update the advisor record with the new profile picture relative path
      await the_admin.update(
        { profile_url: profilePictureUrl },
        { where: { uuid: the_admin } }
      );
      res.status(200).json({
        status: "success",
        message: "Profile picture updated successfully!",
        data: { profile_url: profilePictureUrl }, // Return the S3 URL to frontend
      });
    } else {
      throw new Error("No file uploaded");
    }
  } catch (error) {
    console.error("Error uploading profile picture:", error.message);
    res
      .status(500)
      .json({ status: "error", message: "Error uploading profile picture" });
  }
};

// Controller function to get all majors/programmes in the faculty
const getCurriculumsByFaculty = async (req, res) => {
  try {
    const { facultyID } = req.params;

    // 1. Fetch the faculty to check its curriculumType (either "Major" or "Programme")
    const facultySearch = await faculty.findOne({
      where: { id: facultyID },
      attributes: ["curriculumType", "facultyName"],
    });

    if (!faculty) {
      return res.status(404).json({
        status: "fail",
        message: "Faculty not found",
      });
    }

    // 2. Initialize the variable to store the curriculums (majors/programmes)
    let curriculums = [];

    // 3. Fetch majors if the faculty offers majors
    if (facultySearch.curriculumType === "Major") {
      curriculums = await major.findAll({
        include: {
          model: department,
          attributes: [],
          where: { facultyID },
        },
        attributes: ["id", "majorName"],
      });
    }

    // 4. Fetch programmes if the faculty offers programmes
    if (facultySearch.curriculumType === "Programme") {
      curriculums = await programme.findAll({
        include: {
          model: department,
          attributes: [],
          where: { facultyID },
        },
        attributes: ["id", "programmeName"],
      });
    }

    // 5. If no curriculums found
    if (curriculums.length === 0) {
      return res.status(404).json({
        status: "fail",
        message: `No ${facultySearch.curriculumType.toLowerCase()}s found for this faculty`,
      });
    }

    // 6. Send success response with the curriculums (majors/programmes)
    return res.status(200).json({
      status: "success",
      faculty: facultySearch.facultyName,
      curriculumType: facultySearch.curriculumType,
      data: curriculums,
    });
  } catch (error) {
    console.error("Error fetching curriculums for faculty:", error.message);
    return res.status(500).json({
      status: "fail",
      message: "Internal Server Error",
    });
  }
};

// Controller function to get all advisors in a faculty
const getAdvisorsByFaculty = async (req, res) => {
  try {
    const { facultyID } = req.params;

    // 1. Fetch all advisors in the faculty based on the facultyID
    const advisors = await advisor.findAll({
      where: { facultyID },
      attributes: [
        "uuid",
        "name",
        "surname",
        "email",
        "office",
        "advisor_level",
      ],
    });

    // 2. If no advisors found for the faculty
    if (!advisors || advisors.length === 0) {
      return res.status(404).json({
        status: "fail",
        message: "No advisors found for this faculty.",
      });
    }

    // 3. Return success response with the advisors
    return res.status(200).json({
      status: "success",
      data: advisors,
    });
  } catch (error) {
    console.error("Error fetching advisors by faculty:", error.message);
    return res.status(500).json({
      status: "fail",
      message: "Internal Server Error",
    });
  }
};

// Controller to get all departments under a faculty
const getDepartments = async (req, res) => {
  try {
    const { facultyID } = req.params;

    // Fetch departments that belong to the specified faculty
    const departments = await department.findAll({
      where: { facultyID },
      attributes: ["id", "name"], // Get department ID and name
    });

    // If no departments are found
    if (!departments || departments.length === 0) {
      return res.status(404).json({
        status: "fail",
        message: "No departments found for this faculty",
      });
    }

    // Return the list of departments
    return res.status(200).json({
      status: "success",
      data: departments,
    });
  } catch (error) {
    console.error("Error fetching departments for faculty:", error.message);
    return res.status(500).json({
      status: "fail",
      message: "Internal Server Error",
    });
  }
};

// Controller to add a new curriculum (major/programme) to a faculty
const addCurriculum = async (req, res) => {
  try {
    const { facultyID } = req.params;
    const { curriculumID, curriculumName, departmentID } = req.body;
    const facultyExists = await faculty.findOne({
      where: { id: facultyID },
    });
    const curriculumType = facultyExists.curriculumType;
    // Validate departmentID
    const departmentExists = await department.findOne({
      where: { id: departmentID, facultyID },
    });

    if (!departmentExists) {
      return res.status(404).json({
        status: "fail",
        message:
          "Department not found or does not belong to the specified faculty.",
      });
    }

    let newCurriculum;

    // Handle Major addition
    if (curriculumType === "Major") {
      // Validate required fields for Major
      if (!curriculumName) {
        return res.status(400).json({
          status: "fail",
          message: "Major name is required.",
        });
      }

      // Create a new Major
      newCurriculum = await major.create({
        id: curriculumID, // Major ID
        majorName: curriculumName,
        departmentID,
      });
    }

    // Handle Programme addition
    else if (curriculumType === "Programme") {
      const { prefix, electiveCreditCount } = req.body; // Expect these fields for Programme
      // Validate required fields for Programme
      if (!curriculumName || !prefix || !electiveCreditCount) {
        return res.status(400).json({
          status: "fail",
          message:
            "Programme name, prefix, and elective credit count are required.",
        });
      }

      // Create a new Programme
      newCurriculum = await programme.create({
        id: curriculumID, // Programme ID
        prefix,
        programmeName: curriculumName,
        electiveCreditCount,
        departmentID,
      });
    }

    // Return success response
    return res.status(201).json({
      status: "success",
      message: `${curriculumType} added successfully to the faculty.`,
      data: newCurriculum,
    });
  } catch (error) {
    console.error("Error adding curriculum:", error.message);
    return res.status(500).json({
      status: "fail",
      message: "Internal Server Error",
    });
  }
};

const deleteAdvisor = async (req, res) => {
  try {
    const { advisorID } = req.params;

    // Step 1: Find the advisor
    const advisorToDelete = await advisor.findOne({
      where: { uuid: advisorID },
    });
    if (!advisorToDelete) {
      return res.status(404).json({
        status: "fail",
        message: "Advisor not found.",
      });
    }

    // Step 2: Check if the faculty offers Majors or Programmes
    const facultySearch = await faculty.findOne({
      where: { id: advisorToDelete.facultyID },
      attributes: ["curriculumType"],
    });

    if (!facultySearch) {
      return res.status(404).json({
        status: "fail",
        message: "Faculty not found.",
      });
    }

    // Step 3: Handle the case if the advisor is a senior
    if (advisorToDelete.advisor_level === "senior") {
      // 3.1: Delete the advisorCluster record
      const cluster = await advisorCluster.findOne({
        where: { seniorAdvisorID: advisorToDelete.id },
      });

      if (cluster) {
        // 3.2: Set clusterID = null for all advisors in the cluster
        await advisor.update(
          { clusterID: null },
          { where: { id: { [Op.in]: cluster.advisorIDs } } } // Use Op.in for array matching
        );

        // 3.3: Delete the advisorCluster record
        await advisorCluster.destroy({
          where: { seniorAdvisorID: advisorToDelete.id },
        });
      }

      // 3.4: Remove advisorMajor or advisorProgramme records based on curriculumType
      if (facultySearch.curriculumType === "Major") {
        await advisorMajor.destroy({
          where: { advisorID: advisorToDelete.id },
        });
      } else if (facultySearch.curriculumType === "Programme") {
        await advisorProgramme.destroy({
          where: { advisorID: advisorToDelete.id },
        });
      }

      // Step 4: Handle the case if the advisor is a regular advisor
    } else {
      if (advisorToDelete.clusterID) {
        // 4.1: Remove the advisor from the advisorCluster array
        await advisorCluster.update(
          {
            advisorIDs: sequelize.fn(
              "array_remove",
              sequelize.col("advisorIDs"),
              advisorToDelete.id // Remove the advisor from the advisorIDs array
            ),
          },
          { where: { id: advisorToDelete.clusterID } } // Match based on the correct clusterID
        );
        // 4.2: Set the advisor's clusterID to null
        await advisor.update(
          { clusterID: null },
          { where: { id: advisorToDelete.id } }
        );
      }

      // 4.3: Remove advisorMajor or advisorProgramme records based on curriculumType
      if (facultySearch.curriculumType === "Major") {
        await advisorMajor.destroy({
          where: { advisorID: advisorToDelete.id },
        });
      } else if (facultySearch.curriculumType === "Programme") {
        await advisorProgramme.destroy({
          where: { advisorID: advisorToDelete.id },
        });
      }
    }

    // Step 5: Handle appointments, advice logs, and uploaded files
    await appointment.destroy({ where: { advisorID: advisorToDelete.id } });
    await adviceLog.destroy({ where: { advisorID: advisorToDelete.id } });
    await uploadedFile.destroy({ where: { advisorID: advisorToDelete.id } });
    await availability.destroy({ where: { advisorID: advisorToDelete.id } });

    // Step 6: Finally, delete the advisor from the advisor table
    await advisor.destroy({ where: { id: advisorToDelete.id } });

    return res.status(200).json({
      status: "success",
      message: "Advisor deleted successfully.",
    });
  } catch (error) {
    console.error("Error deleting advisor:", error.message);
    return res.status(500).json({
      status: "fail",
      message: "Internal Server Error",
    });
  }
};

module.exports = {
  updateProfilePicture,
  getFacultyAdminDashboard,
  getAllCoursesByFacultyID,
  getCurriculumsByFaculty,
  getAdvisorsByFaculty,
  getDepartments,
  addCurriculum,
  deleteAdvisor,
};
