const express = require("express");
const facultyAdminController = require("../controllers/facultyAdminController");
const router = express.Router();

//all courses in the system
router
  .route("/:facultyID/courses")
  .get(facultyAdminController.getAllCoursesByFacultyID);
//all advisors in the system
router.route("/:facultyID/advisors").get();
module.exports = router;
