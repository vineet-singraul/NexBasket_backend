const express = require("express");
const {
  generateShortDescription,
  generateSpecificationOfProduct,
  autoGenrateSeoOrProductMnageMnet,
  aiAutomaticallyValidateProduct,
  autoBrandPridiction
} = require("../../controllers/Owner/Ai_Model/autoGenrate.controller.js");

const router = express.Router();

router.get(
  "/generateShortDescription/:length/:productName",
  generateShortDescription,
);

router.get(
  "/generateSpecificationOfProduct/:productName",
  generateSpecificationOfProduct,
);

router.get(
  "/autoGenrateSeoOrProductMnageMnet/:productName",
  autoGenrateSeoOrProductMnageMnet,
);

router.post("/aiAutomaticallyValidateProduct", aiAutomaticallyValidateProduct);


router.post("/autoBrandPridiction", autoBrandPridiction)

module.exports = router