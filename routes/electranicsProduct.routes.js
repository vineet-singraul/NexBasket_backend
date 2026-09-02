const express = require("express");

const {
  createElectronicsProduct,
  getElectronicsProduct,
  updateElectronicsProduct,
  deleteElectronicsProduct,
} = require("../controllers/Owner/Products/electranics/electranics.controller.js");

const router = express.Router();

router.post("/createElectronicsProduct", createElectronicsProduct);
router.get("/:productId", getElectronicsProduct);
router.put("/:productId", updateElectronicsProduct);
router.delete("/:productId", deleteElectronicsProduct);

module.exports = router;
