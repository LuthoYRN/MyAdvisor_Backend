const express = require("express");
const studentController = require("./../controllers/studentController");
const router = express.Router();

//signup
router
  .route("/:studentID/advisors")
  .get(studentController.getAdvisorsForStudent);
module.exports = router;