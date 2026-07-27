const Category = require("../models/category.model.js");

const addCategory = async (req, res) => {
  const {
    OwnerId,
    MainOwnerName,
    productCategory,
    categoryDescription,
    categoryActive,
  } = req.body;

  try {
    const createdCategory = await Category.create({
      OwnerId,
      MainOwnerName,
      productCategory,
      categoryDescription,
      categoryActive,
    });

    res.status(201).json({
      success: true,
      message: "Category created successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || "Failed to create category",
    });
  }
};


const getSingleOwnerCategory = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        message: "Owner ID is required",
      });
    }

    const categories = await Category.find({ OwnerId: id });

    res.status(200).json({
      success: true,
      data: categories,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


module.exports = { addCategory,getSingleOwnerCategory };