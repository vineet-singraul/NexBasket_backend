const express = require("express");

const {
  createBaseProduct,
} = require("../controllers/Owner/Products/common/productBase.controller.js");
const {
  addProductImages,
  getProductImages,
  deleteProductImage,
} = require("../controllers/Owner/Products/common/productImage.controller.js");
const upload = require("../middlewares/upload.middleware.js");

const router = express.Router();

router.post("/createBaseProduct", createBaseProduct);

router.post("/:productId/images", upload.array("images", 10), addProductImages);
router.get("/:productId/images", getProductImages);
router.delete("/images/:imageId", deleteProductImage);

module.exports = router;
