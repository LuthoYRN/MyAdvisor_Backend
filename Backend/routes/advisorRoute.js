const express = require("express");
const advisorController = require("./../controllers/advisorController");
const router = express.Router();

//dashboard
router.route("/:advisorID").get(advisorController.getAdvisorDashboard);
//updating schedule
router
  .route("/:advisorID/schedule")
  .get(advisorController.getAdvisorSchedule)
  .post(advisorController.updateAdvisorSchedule);
module.exports = router;
