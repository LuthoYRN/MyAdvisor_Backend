const express = require("express");
const smartAdvisorController = require("./../controllers/smartAdvisorController");
const router = express.Router();

//course information
router
  .route("/progress/:studentID")
  .get(smartAdvisorController.getCourseProgress);
router
  .route("/equivalents/:courseID")
  .get(smartAdvisorController.getEquivalents);
router
  .route("/prerequisites/:courseID")
  .get(smartAdvisorController.getCoursePrerequisitesAndRequirements);
router
  .route("/credits/:studentID")
  .get(smartAdvisorController.getStudentCredits);
module.exports = router;
