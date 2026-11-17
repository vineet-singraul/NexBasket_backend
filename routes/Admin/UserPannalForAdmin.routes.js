const express = require("express");
const { getAllUserForAdmin } = require("../../controllers/Admin/User Controller/UsersPannalForAdmin.controller.js");
const router = express.Router();


router.get("/getAllUserForAdmin" , getAllUserForAdmin);

module.exports = router