const { ValidationError } = require("sequelize");
const {
  advisor,
  faculty,
  student,
  major,
  department,
  studentsMajor,
} = require("../db/models");
const bcrypt = require("bcrypt");

//returns faculties for signup page dropdown
const getFaculties = async (req, res) => {
  try {
    const faculties = await faculty.findAll();
    if (!faculties || faculties.length === 0) {
      return res.status(404).json({
        status: "fail",
        message: "No faculties found",
      });
    }
    return res.status(200).json({
      status: "success",
      data: faculties,
    });
  } catch (error) {
    console.error("Error during fetching faculties:", error.message);
    return res.status(500).json({
      status: "fail",
      message: "Internal Server Error",
    });
  }
};
//returns majors under faculty from dropdown
const getMajorsbyFaculty = async (req, res) => {
  try {
    const { facultyID } = req.params;
    const majors = await major.findAll({
      include: {
        model: department,
        where: { facultyID }, // Filtering by faculty ID
        attributes: [],
      },
      attributes: ["id", "majorName"],
    });
    if (!majors || majors.length === 0) {
      return res.status(404).json({
        status: "fail",
        message: "No majors found",
      });
    }
    return res.status(200).json({
      status: "success",
      data: majors,
    });
  } catch (error) {
    console.error("Error during fetching majors:", error.message);
    return res.status(500).json({
      status: "fail",
      message: "Internal Server Error",
    });
  }
};

// Signup function
const signup = async (req, res) => {
  try {
    const {
      name,
      surname,
      email,
      password,
      confirmPassword,
      majors,
      programmeID,
    } = req.body;

    // Check if the email is already used
    const existingStudent = await student.findOne({
      where: { email: email },
    });

    // If student already exists, return a conflict response
    if (existingStudent) {
      return res.status(409).json({
        status: "fail",
        message: "Email is already in use",
      });
    }
    // Ensure password and confirmPassword match
    if (password !== confirmPassword) {
      return res.status(400).json({
        status: "fail",
        message: "Passwords do not match",
      });
    } else if (password.length < 6 || password.length > 255) {
      return res.status(400).json({
        status: "fail",
        message: "Password should be between 6 and 255 characters long.",
      });
    }
    // Create the new student
    const newStudent = await student.create({
      name,
      surname,
      email,
      password: bcrypt.hashSync(confirmPassword, 10), // Hash password for security // Ensure your model handles hashing
      programmeID: programmeID || null, // If no programme selected, set to null
    });

    const result = newStudent.toJSON();

    // Assign majors to the student if provided
    if (majors && majors.length > 0) {
      majors.forEach(async (majorID) => {
        await studentsMajor.create({
          studentID: result.id,
          majorID: majorID,
        });
      });
    }

    return res.status(201).json({
      status: "success",
      user_id: result.uuid,
    });
  } catch (error) {
    console.error("Error during signup:", error.message);
    if (error.name == "SequelizeValidationError") {
      const validationErrors = error.errors.map((err) => err.message); // Collect all validation error messages
      const fieldErrors = error.errors.map((err) => err.path); // Collect which fields caused the error

      // Initialize default error message
      let message = [];

      // Check for specific field errors
      if (fieldErrors.includes("name")) {
        message.push("Name cannot be empty.");
      }
      if (fieldErrors.includes("surname")) {
        message.push("Surname cannot be empty.");
      }
      if (fieldErrors.includes("email")) {
        message.push("Invalid email format.");
      }
      return res.status(400).json({
        status: "fail",
        message: message,
      });
    }

    return res.status(500).json({
      status: "fail",
      message: "Internal Server Error",
    });
  }
};

// Login function
const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    // Check if email, password, and role are provided
    if (!email || !password || !role) {
      return res.status(400).json({
        status: "fail",
        message: "Please provide email, password, and role",
      });
    }

    // Handle student login
    if (role === "student") {
      const result = await student.findOne({ where: { email } });

      // If student not found or passwords don't match
      if (!result || !(await bcrypt.compare(password, result.password))) {
        return res.status(400).json({
          status: "fail",
          message: "Incorrect email or password",
        });
      }

      const logged_in = result.toJSON();
      return res.status(200).json({
        status: "success",
        user_type: "student",
        user_id: logged_in.uuid,
      });

      // Handle advisor login
    } else if (role === "advisor") {
      const result = await advisor.findOne({ where: { email } });

      // If advisor not found or passwords don't match
      if (!result || !(await bcrypt.compare(password, result.password))) {
        return res.status(400).json({
          status: "fail",
          message: "Incorrect email or password",
        });
      }
      const logged_in = result.toJSON();

      return res.status(200).json({
        status: "success",
        user_type: "advisor",
        user_id: logged_in.uuid,
      });
    } else {
      return res
        .status(400)
        .json({ status: "fail", message: "Invalid role provided" });
    }
  } catch (error) {
    console.error("Error during login:", error.message);
    return res
      .status(500)
      .json({ status: "fail", message: "Internal Server Error" });
  }
};

module.exports = { signup, login, getFaculties, getMajorsbyFaculty };
