const express = require("express");
const authController = require("./../controllers/authController");
const router = express.Router();

//signup
router
  .route("/signup")
  .post(authController.signup)
  .get(authController.getFaculties);
//signup/:facultyID
router.route("/signup/:facultyID").get(authController.getCurriculumsByFaculty);
//signup/:studentID/courses
router
  .route("/signup/:studentID/courses")
  .post(authController.addCompletedCourses)
  .get(authController.getCoursesForStudent);
//login
router.route("/login").post(authController.login);
module.exports = router;
