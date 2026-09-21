const express = require("express");
const {
  generateShortDescription,
  generateSpecificationOfProduct,
  autoGenrateSeoOrProductMnageMnet,
  aiAutomaticallyValidateProduct,
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

module.exports = router