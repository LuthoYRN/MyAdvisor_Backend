const express = require("express");
const studentController = require("./../controllers/studentController");
const router = express.Router();
const { uploadImage, uploadDocument } = require("../middlewares/upload");

//dashboard
router.route("/:studentID").get(studentController.getStudentDashboard);
//profile-pic-update
router.post(
  "/:studentID/uploadProfilePicture",
  uploadImage.single("profilePicture"),
  studentController.updateProfilePicture
);
//notifications
router
  .route("/:studentID/notifications")
  .get(studentController.getStudentNotifications)
  .patch(studentController.markAllNotificationsAsRead);
//on-notification click
router
  .route("/:studentID/notifications/:notificationID")
  .patch(studentController.markNotificationAsRead)
  .delete();
//booking an appointment
router
  .route("/:studentID/advisors")
  .get(studentController.getAdvisorsForStudent);

router
  .route("/:studentID/:advisorID/appointment/availability")
  .get(studentController.getAdvisorAvailability)
  .post(uploadDocument.single("document"), studentController.bookAppointment);

module.exports = router;
