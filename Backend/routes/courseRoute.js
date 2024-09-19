const express = require("express");
const courseController = require("../controllers/courseController");
const router = express.Router();

//add new course to system
router
  .route("/add")
  .get(courseController.getAllCourses)
  .post(courseController.addNewCourse);
//edit
router
  .route("/:courseID/edit")
  .get(courseController.getCourseForEditing)
  .patch(courseController.updateCourse);
module.exports = router;
