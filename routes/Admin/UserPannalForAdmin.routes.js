const express = require("express");
const {
  getAllUserForAdmin,
  getUserDetailsForAdmin,
  getUserAllAddressForAdmin,
} = require("../../controllers/Admin/User Controller/UsersPannalForAdmin.controller.js");
const router = express.Router();

router.get("/getAllUserForAdmin", getAllUserForAdmin);
router.get("/getUserDetailsForAdmin/:userId", getUserDetailsForAdmin);
router.get("/getUserAllAddressForAdmin/:userId", getUserAllAddressForAdmin);

module.exports = router