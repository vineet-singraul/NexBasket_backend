const express = require("express");

const {
  createBaseProduct,
  createProductVariant,
  createProductInventory,
  addProductImages,
  getProductImages,
  deleteProductImage,
  addProductSpecification,
  getProductSpecifications,
} = require("../controllers/Products/common/productBase.controller.js");
const upload = require("../middlewares/upload.middleware.js");

const router = express.Router();

router.post("/createBaseProduct", createBaseProduct);
router.post("/createVariant", createProductVariant);
router.post("/createInventory", createProductInventory);

router.post("/:productId/images", upload.array("images", 10), addProductImages);
router.get("/:productId/images", getProductImages);
router.delete("/images/:imageId", deleteProductImage);

router.post("/specifications", addProductSpecification);
router.get("/:productId/specifications", getProductSpecifications);

module.exports = router;