const express = require("express");
const sysAdminController = require("../controllers/sysAdminController");
const router = express.Router();

//all courses in the system
router.route("/users").get(sysAdminController.getAllUsersForAdmin);
module.exports = router;
