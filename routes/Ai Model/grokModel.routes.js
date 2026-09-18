const express = require("express");
const {
  autoGenrateProductFeatures,
  autoGenrateProductHighlights,
} = require("../../controllers/Owner/Ai_Model/autoGenFeatures.controllr.js");
const router = express.Router();

router.post("/autoGenrateProductFeatures", autoGenrateProductFeatures);
router.post("/autoGenrateProductHighlights", autoGenrateProductHighlights);

module.exports = router;
