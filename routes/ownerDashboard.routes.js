const express = require("express");
const {getOwnerDashbordDetils} = require("../controllers/Owner/OwnerDashbord/ownerDashbord.controller.js")

const router = express.Router();

router.get("/:storeId/:ownerId",getOwnerDashbordDetils)

module.exports = router;