const express = require("express");

const {
  createBaseProduct,
  createProductVariant,
  createProductInventory,
} = require("../controllers/Products/common/productBase.controller.js");

const router = express.Router();

router.post("/createBaseProduct", createBaseProduct);
router.post("/createVariant", createProductVariant);
router.post("/createInventory", createProductInventory);

module.exports = router;
