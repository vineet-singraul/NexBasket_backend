const express = require("express");

const {
  createBaseProduct,editBaseProduct,deleteBaseProduct
} = require("../controllers/Owner/Products/common/productBase.controller.js");
const {
  addProductImages,
  getProductImages,
  deleteProductImage,
} = require("../controllers/Owner/Products/common/productImage.controller.js");
const upload = require("../middlewares/upload.middleware.js");

const router = express.Router();

router.post("/createBaseProduct", createBaseProduct);
router.put("/editBaseProduct/:productId", editBaseProduct);
router.delete("/deleteBaseProduct/:productId", deleteBaseProduct)

router.post("/:productId/images", upload.array("images", 10), addProductImages);
router.get("/:productId/images", getProductImages);
router.delete("/images/:imageId", deleteProductImage);

module.exports = router;
