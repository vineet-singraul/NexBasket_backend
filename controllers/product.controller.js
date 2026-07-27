const productModel = require("../models/product.model.js");

const CreateProducts = async (req, res) => {
  const {
    store,
    category,
    name,
    description,
    description1,
    brand,
    price,
    mrp,
    discountPercent,
    stock,
    sku,
    tags,
    ratings,
    returnable,
    warrantyPeriod,
    weight,
    dimensions,
    isActive,
  } = req.body;

  if (
    !store ||
    !category ||
    !name ||
    !description ||
    !description1 ||
    price == null ||
    mrp == null
  ) {
    return res.status(400).json({
      success: false,
      message:
        "Store, category, name, description, description1, price and mrp are required.",
    });
  }

  try {
    const product = await productModel.create({
      store,
      category,
      name,
      description,
      description1,
      brand,
      price,
      mrp,
      discountPercent,
      stock,
      sku,
      tags,
      ratings,
      returnable,
      warrantyPeriod,
      weight,
      dimensions,
      isActive,
    });

    return res.status(201).json({
      success: true,
      message: "Product added successfully",
      data: product,
    });
  } catch (error) {
    console.error("Create Product Error:", error);

    return res.status(400).json({
      success: false,
      message: error.message || "Failed to create product",
    });
  }
};

const getOwnerProducts = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({
      success: false,
      message: "Store ID is required.",
    });
  }

  try {
    const products = await productModel.find({ store: id });

    return res.status(200).json({
      success: true,
      message: "Products fetched successfully.",
      data: products,
    });
  } catch (error) {
    console.error("Get Owner Products Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch products",
    });
  }
};

const deleteOwnerProducts = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({
      success: false,
      message: "Product ID is required.",
    });
  }

  try {
    const product = await productModel.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    await productModel.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Product deleted successfully.",
    });
  } catch (error) {
    console.error("Delete Product Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to delete product",
    });
  }
};

module.exports = { CreateProducts, getOwnerProducts, deleteOwnerProducts };
