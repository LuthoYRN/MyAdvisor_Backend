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
      "https://myadvisor-store.s3.af-south-1.amazonaws.com/profile-pictures/default.png";

    // If there's an existing profile picture that's not the default, delete it
    if (currentProfilePicture && !isDefaultPicture) {
      // Extract the key (file name) from the current profile picture URL
      const currentProfilePictureKey = currentProfilePicture.split(".com/")[1];
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

module.exports = {
  updateProfilePicture,
  getFacultyAdminDashboard,
  getAllCoursesByFacultyID,
};
