const express = require("express");
const courseController = require("../controllers/courseController");
const router = express.Router();

//add new course to system
router.route("/add").get();
//edit
router
  .route("/:courseID/edit")
  .get(courseController.getCourseForEditing)
  .patch();
module.exports = router;
