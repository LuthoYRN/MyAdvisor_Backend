const express = require("express");
const curriculumController = require("./../controllers/curriculumController");
const router = express.Router();
//getting all courses by curriculum
router
  .route("/:currID/courses")
  .get(curriculumController.getCoursesByCurriculum);
router
  .route("/:currID/courses/:courseID") //individual course list
  .get(curriculumController.checkIfSafeToDelete) //on delete click
  .delete(curriculumController.deleteCourseFromCurriculum); //on delete modal click
//add existing course to curriculum
router.route("/:currID/courses/addExisting").get();
module.exports = router;
