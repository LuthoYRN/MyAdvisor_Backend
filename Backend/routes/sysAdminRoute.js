const express = require("express");
const sysAdminController = require("../controllers/sysAdminController");
const router = express.Router();

//all courses in the system
router.route("/users").get(sysAdminController.getAllUsersForAdmin);
//add admin
router.route("/users/add/admin");
//add advisor
router.route("/users/add/advisor");
module.exports = router;
