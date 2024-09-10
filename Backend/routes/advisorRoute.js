const express = require("express");
const advisorController = require("./../controllers/advisorController");
const router = express.Router();

//dashboard
router.route("/:advisorID").get(advisorController.getAdvisorDashboard);
//appointment details
router
  .route("/:advisorID/appointment/:appointmentID")
  .get(advisorController.getAppointmentDetails);
//record-meeting
router
  .route("/:advisorID/appointment/:appointmentID/note")
  .post(advisorController.recordMeetingNotes);
//log
router.route("/:advisorID/log").get(advisorController.getLog);
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
  .post(advisorController.handleAppointmentRequest);
//updating schedule
router
  .route("/:advisorID/schedule")
  .get(advisorController.getAdvisorSchedule)
  .post(advisorController.updateAdvisorSchedule);
module.exports = router;
