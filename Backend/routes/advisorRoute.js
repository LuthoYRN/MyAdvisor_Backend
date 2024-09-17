const express = require("express");
const advisorController = require("./../controllers/advisorController");
const curriculumController = require("./../controllers/curriculumController");
const router = express.Router();
const { uploadImage, uploadVideo } = require("../middlewares/upload");
//dashboard
router.route("/:advisorID").get(advisorController.getAdvisorDashboard);
//course management
router
  .route("/:advisorID/curriculums")
  .get(curriculumController.getCurriculumsForAdvisor);
//delete
router
  .route("/:advisorID/curriculums/:currID")
  .delete(curriculumController.deleteAdvisorCurriculum);
//profile-picture
router.post(
  "/:advisorID/uploadProfilePicture",
  uploadImage.single("profilePicture"),
  advisorController.updateProfilePicture
);
//appointment details
router
  .route("/:advisorID/appointment/:appointmentID")
  .get(advisorController.getAppointmentDetails);
//record-meeting
router
  .route("/:advisorID/appointment/:appointmentID/note")
  .post(advisorController.recordMeetingNotes);
//record-video
router
  .route("/:advisorID/appointment/:appointmentID/video")
  .post(uploadVideo.single("video"), advisorController.recordVideo);
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
