const express = require("express");
const authController = require("./../controllers/authController");
const router = express.Router();

router
  .route("/signup")
  .post(authController.signup)
  .get(authController.getFaculties);
router.route("/signup/:facultyID").get(authController.getMajorsbyFaculty);
router.route("/login").post(authController.login);
module.exports = router;
