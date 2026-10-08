const express = require("express");

const  {getFilteredProduct} = require("../../controllers/Users/products_Fillters/getFilteredProduct.controller.js");

const router = express.Router();

router.get("/getFilteredProduct/:filterOption", getFilteredProduct);

module.exports = router;