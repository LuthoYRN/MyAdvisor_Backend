const student = require("../db/models/student");
const advisor = require("../db/models/advisor");
const bcrypt = require("bcrypt");

const signup = async (req, res) => {
  try {
    const body = req.body;

    // Student model takes care of the password and confirmPassword validation.
    const newStudent = await student.create({
      name: body.name,
      surname: body.surname,
      email: body.email,
      password: body.password, // Student model handles hashing
      confirmPassword: body.confirmPassword, // Validates password matching
      programmeID: body.programmeID,
      profile_url: body.profile_url,
    });

    const result = newStudent.toJSON();
    delete result.email;
    delete result.password; // Remove password from returned result

    return res.status(201).json({
      status: "success",
      data: result,
    });
  } catch (error) {
    console.error("Error during signup:", error.message);
    return res
      .status(500)
      .json({ status: "fail", message: "Internal Server Error" });
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
      delete logged_in.password;
      delete logged_in.email;

      return res.status(200).json({
        status: "success",
        user_type: "student",
        user_id: logged_in.id,
      });

      // Handle advisor login
    } else if (role === "advisor") {
      const result = await advisor.findOne({ where: { email } });

      // If advisor not found or passwords don't match
      if (!result || !(password == result.password)) {
        return res.status(400).json({
          status: "fail",
          message: "Incorrect email or password",
        });
      }
      const logged_in = result.toJSON();

      return res.status(200).json({
        status: "success",
        user_type: "advisor",
        user_id: logged_in.id,
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

module.exports = { signup, login };
