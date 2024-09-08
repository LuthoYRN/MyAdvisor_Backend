const express = require("express");
const studentController = require("./../controllers/studentController");
const router = express.Router();

//signup
router
  .route("/:studentID/advisors")
  .get(studentController.getAdvisorsForStudent);

//appointment
router
.route("/:studentID/:advisorID/appointment/availability")
.get(studentController.getAdvisorAvailability)

module.exports = router;