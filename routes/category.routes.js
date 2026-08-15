const express = require("express");

const categoryModel = require("../models/product_model/A_Category_of_product/category.model.js");
const {createCategoryOfProduct} = require("../controllers/Products/category/category.controller.js")

const router = express.Router();

router.post("/createCategoryOfProduct", createCategoryOfProduct);

module.exports = router;