const express = require("express");

const categoryModel = require("../models/product_model/category/category.model.js");
const {createCategoryOfProduct} = require("../controllers/Products/category/category.controller.js")

const router = express.Router();

router.post("/createCategoryOfProduct", createCategoryOfProduct);

module.exports = router;