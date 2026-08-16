const express = require("express");

const {
  createCategoryOfProduct,
  getSingleOwnerCategory,
  getAllCategoriesOfProduct,
  getCategoryOfProductById,
  updateCategoryOfProduct,
  deleteCategoryOfProduct,
} = require("../controllers/Products/category/category.controller.js");

const router = express.Router();

router.post("/createCategoryOfProduct", createCategoryOfProduct);
router.get("/getAllCategoriesOfProduct", getAllCategoriesOfProduct);
router.get("/getSingleOwnerCategory/:id", getSingleOwnerCategory);
router.get("/getCategoryOfProductById/:categoryId", getCategoryOfProductById);
router.put("/updateCategoryOfProduct/:categoryId", updateCategoryOfProduct);
router.delete("/deleteCategoryOfProduct/:categoryId", deleteCategoryOfProduct);

module.exports = router;
