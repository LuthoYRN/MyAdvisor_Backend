const express = require("express");
const sysAdminController = require("../controllers/sysAdminController");
const authController = require("./../controllers/authController");
const router = express.Router();

//all courses in the system
router.route("/users").get(sysAdminController.getAllUsersForAdmin);
//add admin
router
  .route("/users/add/admin")
  .get(authController.getFaculties)
  .post(sysAdminController.addAdmin);
//add advisor
router
  .route("/users/add/advisor")
  .get(authController.getFaculties)
  .post(sysAdminController.addAdvisor);
router
  .route("/users/add/advisor/:facultyID")
  .get(authController.getCurriculumsByFaculty);
//return all advisors not in a cluster
router
  .route("/users/add/advisor/:facultyID/senior")
  .get(sysAdminController.getCluster);
//return all senior advisors in the system
router
  .route("/users/add/advisor/:facultyID/junior")
  .get(sysAdminController.getSeniors);
module.exports = router;
