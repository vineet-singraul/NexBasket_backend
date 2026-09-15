const { createFillters } = require("../../controllers/Admin/CreateFillter/filterDefinition.controller.js");
const express = require("express");
const router = express.Router();
const {protect} = require("../../middlewares/auth.middleware.js")
const {isAdmin} = require("../../middlewares/IsAdminAuth.js")

// Create the Post .....
router.post("/createFillters",protect,isAdmin, createFillters);

module.exports = router;
  