const student = require("../db/models/student");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const signup = async (req, res) => {
  const body = req.body;
  const newStudent = await student.create({
    name: body.name,
    surname: body.surname,
    email: body.email,
    password: body.password,
    confirmPassword: body.confirmPassword,
    programmeID: body.programmeID,
    profile_url: body.profile_url,
  });

  const result = newStudent.toJSON();
  delete result.password;
  result.token = generateToken({
    id: newStudent.id,
  });
  if (!result) {
    return res
      .status(400)
      .json({ status: "fail", message: "Failed to create student" });
  }

  return res.status(201).json({
    status: "success",
    data: result,
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(400)
      .json({ status: "fail", message: "Please provide email and password}" });
  }
  const result = await student.findOne({ where: { email } });
  if (!result || !(await bcrypt.compare(password, result.password))) {
    return res
      .status(400)
      .json({ status: "fail", message: "Incorrect email or password" });
  }

  const token = generateToken({
    id: result.id,
  });

  return res.status(200).json({
    status: "success",
    token,
  });
};
module.exports = { signup, login };
