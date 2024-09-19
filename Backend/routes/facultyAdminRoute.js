const express = require("express");
const facultyAdminController = require("../controllers/facultyAdminController");
const router = express.Router();
const { uploadImage } = require("../middlewares/upload");

//Dashboard
router.route("/:adminID").get(facultyAdminController.getFacultyAdminDashboard);
//profile-picture
router.post(
  "/:adminID/uploadProfilePicture",
  uploadImage.single("profilePicture"),
  facultyAdminController.updateProfilePicture
);
//all majors/programmes in the faculty
router
  .route("/:facultyID/curriculums")
  .get(facultyAdminController.getCurriculumsByFaculty);
//adding curriculum
router
  .route("/:facultyID/curriculums/add")
  .get(facultyAdminController.getDepartments);
  //.post(facultyAdminController.addCurriculum);
//all courses in the system
router
  .route("/:facultyID/courses")
  .get(facultyAdminController.getAllCoursesByFacultyID);
//all advisors in the system
router.route("/:facultyID/advisors").get(facultyAdminController.getAdvisorsByFaculty);
module.exports = router;
