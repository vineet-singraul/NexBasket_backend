const express = require("express");
const {
  getAllUserForAdmin,
  getUserDetailsForAdmin,
} = require("../../controllers/Admin/User Controller/UsersPannalForAdmin.controller.js");
const router = express.Router();

router.get("/getAllUserForAdmin", getAllUserForAdmin);
router.get("/getUserDetailsForAdmin/:userId", getUserDetailsForAdmin);

module.exports = router