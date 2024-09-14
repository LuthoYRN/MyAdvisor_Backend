const { ValidationError } = require("sequelize");
const { sequelize } = require("../db/models");
const {
  advisor,
  faculty,
  student,
  course,
  completedCourse,
  major,
  facultyAdmin,
  department,
  sharedCourse,
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
      //to be implemented search for prorgammes instead
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
      //yet to implement
    }

    // Create the new student
    const newStudent = await student.create({
      name,
      surname,
      email,
      password: bcrypt.hashSync(confirmPassword, 10), // Hash password for security
      programmeID: programmeID || null, // If no programme selected, set to null
      profile_url:
        "https://myadvisor-store.s3.af-south-1.amazonaws.com/profile-pictures/default.png",
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
    } else if (programmeID) {
      // When the programme implementation is ready
    }

    return res.status(201).json({
      status: "success",
      user_id: result.uuid,
    });
  } catch (error) {
    console.error("Error during signup:", error.message);
    if (error.name === "SequelizeValidationError") {
      const validationErrors = error.errors.map((err) => err.message);
      const fieldErrors = error.errors.map((err) => err.path);

      let message = [];

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
    if (!the_student.programmeID) {
      // Find courses linked to the student's majors using the associations
      const majors = await studentsMajor.findAll({
        where: { studentID: the_student.id },
        attributes: ["majorID"],
      });
      let courses = await sharedCourse.findAll({
        where: { majorID: majors.map((el) => el.majorID) },
        attributes: ["courseID"],
        order: [[sequelize.literal('SUBSTRING("courseID", 4, 1)'), "ASC"]],
      });
      //make the courses not duplicated
      courses = [...new Set(courses.map((el) => el.courseID))];
      // Return the courses in the expected format
      return res.status(200).json({
        status: "success",
        student_id: the_student.uuid,
        courses,
      });
    } else {
      //to be implemented, if the student has a programme instead of majors
    }
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
  getMajorsbyFaculty,
  getCoursesForStudent,
  addCompletedCourses,
};
