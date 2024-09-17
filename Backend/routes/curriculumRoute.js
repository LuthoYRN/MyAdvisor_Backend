const express = require("express");
const curriculumController = require("./../controllers/curriculumController");
const router = express.Router();
//getting all courses by curriculum
router
  .route("/:currID/courses")
  .get(curriculumController.getCoursesByCurriculum);
router
  .route("/:currID/courses/:courseID")
  .get(curriculumController.checkIfSafeToDelete)
  .delete(curriculumController.deleteCourseFromCurriculum);
module.exports = router;
