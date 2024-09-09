const express = require("express");
const advisorController = require("./../controllers/advisorController");
const router = express.Router();

//dashboard
router.route("/:advisorID").get(advisorController.getAdvisorDashboard);
//appointmentrequests
router
  .route("/:advisorID/requests")
  .get(advisorController.getAppointmentRequests)
  .patch(advisorController.markAllRequestsAsRead);
//single request
router
  .route("/:advisorID/requests/:requestID")
  .patch(advisorController.markRequestAsRead)
  .get(advisorController.getAppointmentRequestDetails)
  .post();
//approve or reject
router.route("/:advisorID/requests/:requestID?approve=true").post();
//updating schedule
router
  .route("/:advisorID/schedule")
  .get(advisorController.getAdvisorSchedule)
  .post(advisorController.updateAdvisorSchedule);
module.exports = router;
