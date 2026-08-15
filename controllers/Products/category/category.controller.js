const categoryModel = require("../../../models/product_model/category/category.model.js");

// Create Category
const createCategoryOfProduct = async (req, res) => {
  try {
    const { name, slug, description, image, isActive } = req.body;

    if (!name || !slug) {
      return res.status(400).json({
        success: false,
        message: "Category name and slug are required.",
      });
    }

    const existingCategory = await categoryModel.findOne({
      $or: [{ name }, { slug }],
    });

    if (existingCategory) {
      return res.status(409).json({
        success: false,
        message: "Category already exists.",
      });
    }

    const category = await categoryModel.create({
      name,
      slug,
      description,
      image,
      isActive,
    });

    return res.status(201).json({
      success: true,
      message: "Category created successfully.",
      data: category,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to create category.",
      error: error.message,
    });
  }
};


// Get All Categories
const getAllCategoriesOfProduct = async (req, res) => {
  try {
    const categories = await categoryModel
      .find()
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "Categories fetched successfully.",
      count: categories.length,
      data: categories,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch categories.",
      error: error.message,
    });
  }
};


// Get Category By ID
const getCategoryOfProductById = async (req, res) => {
  try {
    const { categoryId } = req.params;

    const category = await categoryModel.findById(categoryId);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Category fetched successfully.",
      data: category,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch category.",
      error: error.message,
    });
  }
};


// Update Category
const updateCategoryOfProduct = async (req, res) => {
  try {
    const { categoryId } = req.params;

    const { name, slug, description, image, isActive } = req.body;

    const category = await categoryModel.findById(categoryId);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found.",
      });
    }

    if (name !== undefined) category.name = name;
    if (slug !== undefined) category.slug = slug;
    if (description !== undefined) category.description = description;
    if (image !== undefined) category.image = image;
    if (isActive !== undefined) category.isActive = isActive;

    await category.save();

    return res.status(200).json({
      success: true,
      message: "Category updated successfully.",
      data: category,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update category.",
      error: error.message,
    });
  }
};


// Delete Category
const deleteCategoryOfProduct = async (req, res) => {
  try {
    const { categoryId } = req.params;

    const category = await categoryModel.findById(categoryId);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found.",
      });
    }

    await categoryModel.findByIdAndDelete(categoryId);

    return res.status(200).json({
      success: true,
      message: "Category deleted successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete category.",
      error: error.message,
    });
  }
};


module.exports = {
  createCategoryOfProduct,
  getAllCategoriesOfProduct,
  getCategoryOfProductById,
  updateCategoryOfProduct,
  deleteCategoryOfProduct,
};