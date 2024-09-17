const express = require("express");
const curriculumController = require("./../controllers/curriculumController");
const router = express.Router();
//getting all courses by curriculum
router
  .route("/:currID/courses")
  .get(curriculumController.getCoursesByCurriculum);
module.exports = router;
