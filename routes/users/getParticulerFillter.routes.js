const express = require("express");

const {
  getParticulerFillter
} = require("../../controllers/Users/products_Fillters/getAllFillters.js");

const router = express.Router();

router.get("/filterModel/:findingKeywords", getParticulerFillter);

module.exports = router;