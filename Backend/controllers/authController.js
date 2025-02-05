const { ValidationError, Op } = require("sequelize");
const { sequelize } = require("../db/models");
const {
  advisor,
  faculty,
  student,
  course,
  completedCourse,
  major,
  programme,
  passwordResetToken,
  facultyAdmin,
  department,
  sharedCourse,
  systemAdmin,
  studentsMajor,
} = require("../db/models");
const bcrypt = require("bcrypt");
const moment = require("moment");
const { sendResetEmail } = require("../utils/email"); // This is where the email logic goes
const crypto = require("crypto");

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // Check if the user exists in any of the tables (student, advisor, facultyAdmin, systemAdmin)
    let user =
      (await student.findOne({ where: { email } })) ||
      (await advisor.findOne({ where: { email } })) ||
      (await facultyAdmin.findOne({ where: { email } })) ||
      (await systemAdmin.findOne({ where: { email } }));

    if (!user) {
      return res.status(404).json({
        status: "fail",
        message: "User with this email not found",
      });
    }

    // Generate a reset token using crypto
    const token = crypto.randomBytes(32).toString("hex");

    // Hash the token and set an expiration time for the reset
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    const tokenExpiration = moment().add(1, "hour").toDate(); // Expires in 1 hour

    // Store the token and expiration in the resetToken table
    await passwordResetToken.create({
      userUUID: user.uuid, // Assuming the user table has a 'userID' or 'id' field
      resetToken: hashedToken,
      expiration: tokenExpiration,
    });

    // Generate the reset link
    const resetLink = `https://my-advisor-frontend.vercel.app/reset-password/${token}`;

    // Send the email with the reset link
    await sendResetEmail(email, resetLink);

    return res.status(200).json({
      status: "success",
      message: "Password reset link sent to your email.",
      resetLink,
    });
  } catch (error) {
    console.error("Error in forgot password:", error.message);
    return res.status(500).json({
      status: "fail",
      message: "Internal Server Error",
    });
  }
};

// Reset Password API
const resetPassword = async (req, res) => {
  try {
    const { tokenID } = req.params; // Extract token from URL
    const { newPassword, confirmPassword } = req.body; // Passwords from request body

    // Ensure passwords match
    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        status: "fail",
        message: "Passwords do not match.",
      });
    }
    // Hash the token from the URL
    const hashedToken = crypto
      .createHash("sha256")
      .update(tokenID)
      .digest("hex");

    // Find the token in the passwordResetToken table
    const tokenRecord = await passwordResetToken.findOne({
      where: {
        resetToken: hashedToken,
        expiration: { [Op.gt]: moment().toDate() },
      }, // Token should not be expired
    });

    if (!tokenRecord) {
      return res.status(400).json({
        status: "fail",
        message: "Token is invalid or has expired.",
      });
    }

    // Determine the user based on the UUID in the token record
    let user =
      (await student.findOne({ where: { uuid: tokenRecord.userUUID } })) ||
      (await advisor.findOne({ where: { uuid: tokenRecord.userUUID } })) ||
      (await facultyAdmin.findOne({ where: { uuid: tokenRecord.userUUID } })) ||
      (await systemAdmin.findOne({ where: { uuid: tokenRecord.userUUID } }));

    if (!user) {
      return res.status(404).json({
        status: "fail",
        message: "User not found.",
      });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password
    user.password = hashedPassword;
    await user.save();

    // Remove the used reset token from the database
    await passwordResetToken.destroy({ where: { resetToken: hashedToken } });

    // Send a success response
    return res.status(200).json({
      status: "success",
      message: "Password updated successfully.",
    });
  } catch (error) {
    console.error("Error resetting password:", error.message);
    return res.status(500).json({
      status: "fail",
      message: "Internal Server Error",
    });
  }
};

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

// Returns majors or programmes under faculty from dropdown
const getCurriculumsByFaculty = async (req, res) => {
  try {
    const { facultyID } = req.params;

    // Find the faculty to check the curriculum type
    const findfaculty = await faculty.findOne({
      where: { id: facultyID },
      attributes: ["curriculumType"], // Only fetch the curriculumType
    });

    if (!findfaculty) {
      return res.status(404).json({
        status: "fail",
        message: "Faculty not found",
      });
    }

    const { curriculumType } = findfaculty;

    // If the faculty offers Majors
    if (curriculumType === "Major") {
      const majors = await major.findAll({
        include: {
          model: department,
          where: { facultyID }, // Filtering by faculty ID
          attributes: [],
        },
        attributes: ["id", "majorName"],
      });

      if (majors && majors.length > 0) {
        return res.status(200).json({
          status: "success",
          curriculumsOffered: "Majors",
          data: majors,
        });
      }

      // If the faculty offers Programme
    } else if (curriculumType === "Programme") {
      const programmes = await programme.findAll({
        include: {
          model: department,
          where: { facultyID }, // Filtering by faculty ID
          attributes: [],
        },
        attributes: ["id", "programmeName"],
      });

      if (programmes && programmes.length > 0) {
        return res.status(200).json({
          status: "success",
          curriculumsOffered: "Programmes",
          data: programmes,
        });
      }
    }
    // If no majors or programmes found
    return res.status(404).json({
      status: "fail",
      message: `No ${curriculumType.toLowerCase()} found for this faculty`,
    });
  } catch (error) {
    console.error("Error during fetching curriculums:", error.message);
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
      majors, // Can be an array of major IDs
      programmeID, // Can be a single programme ID
    } = req.body;

    // Ensure either majors or programme is provided, but not both being null
    if (!majors && !programmeID) {
      return res.status(400).json({
        status: "fail",
        message: "Either majors or programme must be selected.",
      });
    }

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

    // Validate majors if provided
    if (majors && majors.length > 0) {
      const validMajors = await major.findAll({
        where: { id: majors },
        attributes: ["id"],
      });

      const validMajorIDs = validMajors.map((major) => major.id);

      // Check if all provided majors are valid
      if (validMajorIDs.length !== majors.length) {
        return res.status(400).json({
          status: "fail",
          message: "One or more provided majors are invalid.",
        });
      }
    } //
    else if (programmeID) {
      const validProgramme = await programme.findOne({
        where: { id: programmeID },
        attributes: ["id"],
      });

      if (!validProgramme) {
        return res.status(400).json({
          status: "fail",
          message: "Invalid programme selected.",
        });
      }
    }

    // Create the new student
    const newStudent = await student.create({
      name,
      surname,
      email,
      password: bcrypt.hashSync(confirmPassword, 10), // Hash password for security
      programmeID: programmeID || null, // If no programme selected, set to null
      profile_url:
        "https://pub-cfb4608b525a41058b2c8e0e2b138eea.r2.dev/default.png",
    });

    const result = newStudent.toJSON();

    // Assign majors to the student if majors are provided
    if (majors && majors.length > 0) {
      await Promise.all(
        majors.map(async (majorID) => {
          await studentsMajor.create({
            studentID: result.id,
            majorID: majorID,
          });
        })
      );
    }

    return res.status(201).json({
      status: "success",
      user_id: result.uuid,
    });
  } catch (error) {
    console.error("Error during signup:", error.message);

    if (error.name === "SequelizeValidationError") {
      const validationErrors = error.errors.map((err) => err.message); // Collect the error messages
      const fieldErrors = error.errors.map((err) => err.path); // Collect which fields caused the error

      let message = [];

      if (fieldErrors.includes("name")) {
        const nameError = validationErrors.find((msg) =>
          msg.includes("must only contain letters")
        );
        if (nameError) {
          message.push("Name must only contain letters.");
        } else {
          message.push("Name cannot be empty.");
        }
      }

      if (fieldErrors.includes("surname")) {
        const surnameError = validationErrors.find((msg) =>
          msg.includes("must only contain letters")
        );
        if (surnameError) {
          message.push("Surname must only contain letters.");
        } else {
          message.push("Surname cannot be empty.");
        }
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
    const { email, password } = req.body;

    // Check if email and password are provided
    if (!email || !password) {
      return res.status(400).json({
        status: "fail",
        message: "Please provide email and password",
      });
    }

    // First check if the user is a student
    let result = await student.findOne({ where: { email } });
    if (result) {
      // If the student is found, check password
      if (!(await bcrypt.compare(password, result.password))) {
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
    }

    // If not a student, check if the user is an advisor
    result = await advisor.findOne({ where: { email } });
    if (result) {
      // If the advisor is found, check password
      if (!(await bcrypt.compare(password, result.password))) {
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
    }

    // If not an advisor, check if the user is a faculty admin
    result = await facultyAdmin.findOne({ where: { email } });
    if (result) {
      // If the faculty admin is found, check password
      if (!(await bcrypt.compare(password, result.password))) {
        return res.status(400).json({
          status: "fail",
          message: "Incorrect email or password",
        });
      }

      const logged_in = result.toJSON();
      return res.status(200).json({
        status: "success",
        user_type: "facultyAdmin",
        user_id: logged_in.uuid,
      });
    }
    // If not an advisor, check if the user is a faculty admin
    result = await systemAdmin.findOne({ where: { email } });
    if (result) {
      // If the faculty admin is found, check password
      if (!(await bcrypt.compare(password, result.password))) {
        return res.status(400).json({
          status: "fail",
          message: "Incorrect email or password",
        });
      }

      const logged_in = result.toJSON();
      return res.status(200).json({
        status: "success",
        user_type: "systemAdmin",
        user_id: logged_in.id,
      });
    }

    // If the email is not found in any table
    return res.status(400).json({
      status: "fail",
      message: "User not found",
    });
  } catch (error) {
    console.error("Error during login:", error.message);
    return res
      .status(500)
      .json({ status: "fail", message: "Internal Server Error" });
  }
};

//gets all courses for a particular student
const getCoursesForStudent = async (req, res) => {
  try {
    const { studentID } = req.params;
    const the_student = await student.findOne({ where: { uuid: studentID } });
    if (!the_student) {
      return res
        .status(404)
        .json({ status: "fail", message: "Student not found" });
    }

    let courses = [];

    if (!the_student.programmeID) {
      // Find courses linked to the student's majors using the associations
      const majors = await studentsMajor.findAll({
        where: { studentID: the_student.id },
        attributes: ["majorID"],
      });

      if (!majors || majors.length === 0) {
        return res.status(404).json({
          status: "fail",
          message: "Student does not have any majors assigned.",
        });
      }

      courses = await sharedCourse.findAll({
        where: { majorID: majors.map((el) => el.majorID) },
        attributes: ["courseID"],
        order: [[sequelize.literal('SUBSTRING("courseID", 4, 1)'), "ASC"]],
      });
    } else {
      // Student is enrolled in a programme, find courses for that programme
      courses = await sharedCourse.findAll({
        where: { programmeID: the_student.programmeID },
        attributes: ["courseID"],
        order: [[sequelize.literal('SUBSTRING("courseID", 4, 1)'), "ASC"]],
      });

      if (!courses || courses.length === 0) {
        return res.status(404).json({
          status: "fail",
          message: "No courses assigned to this programme yet.",
        });
      }
    }
    courses = [...new Set(courses.map((el) => el.courseID))];
    // Return the courses in the expected format
    return res.status(200).json({
      status: "success",
      student_id: the_student.uuid,
      courses,
    });
  } catch (error) {
    console.error("Error fetching courses for student:", error.message);
    return res.status(500).json({
      status: "fail",
      message: "Internal Server Error",
    });
  }
};

//receives courses the student has completed and populates completedCourse table
const addCompletedCourses = async (req, res) => {
  try {
    const { studentID } = req.params; // Get the student UUID from the route params
    const { courses } = req.body; // Get the array of course IDs from the body

    // Find the student using UUID
    const the_student = await student.findOne({ where: { uuid: studentID } });
    if (!the_student) {
      return res.status(404).json({
        status: "fail",
        message: "Student not found",
      });
    }
    // Loop through the courses and add them to the CompletedCourse table
    const completedCourses = [];
    for (const courseID of courses) {
      // Ensure the course exists
      const foundCourse = await course.findOne({ where: { id: courseID } });
      if (!foundCourse) {
        return res.status(400).json({
          status: "fail",
          message: `Course with ID ${courseID} not found`,
        });
      }
      // Prevent duplicate entries for the same student and course
      const existingRecord = await completedCourse.findOne({
        where: { studentID: the_student.id, courseID: foundCourse.id },
      });
      if (!existingRecord) {
        const newCompletedCourse = await completedCourse.create({
          studentID: the_student.id,
          courseID: foundCourse.id,
        });
        completedCourses.push(newCompletedCourse);
      }
    }
    return res.status(201).json({
      status: "success",
      student_id: studentID,
      data: completedCourses,
    });
  } catch (error) {
    console.error("Error during course addition:", error.message);
    return res.status(500).json({
      status: "fail",
      message: "Internal Server Error",
    });
  }
};

module.exports = {
  signup,
  login,
  getFaculties,
  forgotPassword,
  resetPassword,
  getCurriculumsByFaculty,
  getCoursesForStudent,
  addCompletedCourses,
};
