const BaseProductModel = require("../../../models/product_model/common/productBase.model.js");
const electronicsProductModel = require("../../../models/product_model/electronics/electronicsProduct.model.js");

// Create Electronics Product
const createElectronicsProduct = async (req, res) => {
  const {
    productId,
    deviceType,
    deviceCategory,
    connectivity,
    power,
    warranty,
    isActive,
  } = req.body;

  try {
    if (!productId || !deviceType) {
      return res.status(400).json({
        success: false,
        message: "Product ID and device type are required.",
      });
    }

    const product = await BaseProductModel.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    const existingElectronicsProduct = await electronicsProductModel.findOne({
      productId,
    });

    if (existingElectronicsProduct) {
      return res.status(409).json({
        success: false,
        message: "Electronics details already exist for this product.",
      });
    }

    const electronicsProduct = await electronicsProductModel.create({
      productId,
      deviceType,
      deviceCategory,
      connectivity,
      power,
      warranty,
      isActive,
    });

    return res.status(201).json({
      success: true,
      message: "Electronics product created successfully.",
      data: electronicsProduct,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to create electronics product.",
      error: error.message,
    });
  }
};

// Get Electronics Product By Product ID
const getElectronicsProduct = async (req, res) => {
  const { productId } = req.params;

  try {
    const electronicsProduct = await electronicsProductModel.findOne({
      productId,
    });

    if (!electronicsProduct) {
      return res.status(404).json({
        success: false,
        message: "Electronics product not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Electronics product fetched successfully.",
      data: electronicsProduct,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch electronics product.",
      error: error.message,
    });
  }
};

// Update Electronics Product
const updateElectronicsProduct = async (req, res) => {
  const { productId } = req.params;
  const { deviceType, deviceCategory, connectivity, power, warranty, isActive } =
    req.body;

  try {
    const electronicsProduct = await electronicsProductModel.findOne({
      productId,
    });

    if (!electronicsProduct) {
      return res.status(404).json({
        success: false,
        message: "Electronics product not found.",
      });
    }

    if (deviceType !== undefined) electronicsProduct.deviceType = deviceType;
    if (deviceCategory !== undefined)
      electronicsProduct.deviceCategory = deviceCategory;
    if (connectivity !== undefined)
      electronicsProduct.connectivity = connectivity;
    if (power !== undefined) electronicsProduct.power = power;
    if (warranty !== undefined) electronicsProduct.warranty = warranty;
    if (isActive !== undefined) electronicsProduct.isActive = isActive;

    await electronicsProduct.save();

    return res.status(200).json({
      success: true,
      message: "Electronics product updated successfully.",
      data: electronicsProduct,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update electronics product.",
      error: error.message,
    });
  }
};

// Delete Electronics Product
const deleteElectronicsProduct = async (req, res) => {
  const { productId } = req.params;

  try {
    const electronicsProduct = await electronicsProductModel.findOne({
      productId,
    });

    if (!electronicsProduct) {
      return res.status(404).json({
        success: false,
        message: "Electronics product not found.",
      });
    }

    await electronicsProductModel.findByIdAndDelete(electronicsProduct._id);

    return res.status(200).json({
      success: true,
      message: "Electronics product deleted successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete electronics product.",
      error: error.message,
    });
  }
};

module.exports = {
  createElectronicsProduct,
  getElectronicsProduct,
  updateElectronicsProduct,
  deleteElectronicsProduct,
};
