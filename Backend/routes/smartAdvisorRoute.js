const express = require("express");
const smartAdvisorController = require("./../controllers/smartAdvisorController");
const router = express.Router();

//dashboard
router
  .route("/equivalents/:courseID")
  .get(smartAdvisorController.getEquivalents);
router
  .route("/prerequisites/:courseID")
  .get(smartAdvisorController.getCoursePrerequisitesAndRequirements);

module.exports = router;
