const express = require("express");
const router = express.Router();

const {addProductImages, getProductImageById, deleteProductById} = require("../controllers/productImage.controller.js");

const upload = require("../middlewares/upload.middleware.js");




router.post( "/addProductImages/:productId",  upload.array("images", 5), addProductImages,);
router.get("/getProductImageById/:productId" , getProductImageById)
router.delete("/deleteProductById/:productId", deleteProductById)


module.exports = router ; 