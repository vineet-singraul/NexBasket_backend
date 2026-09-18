const express = require("express");
const {generateShortDescription} = require("../../controllers/Owner/Ai_Model/autoGenrate.controller.js")


const router = express.Router();

router.get("/generateShortDescription/:length/:productName", generateShortDescription);

module.exports = router