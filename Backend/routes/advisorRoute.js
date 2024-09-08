const express = require("express");
const advisorController = require("./../controllers/advisorController");
const router = express.Router();

//signup
router
  .route("/:advisorID/schedule")
  .get(advisorController.getAdvisorSchedule)
  .post(advisorController.updateAdvisorSchedule);
module.exports = router;
