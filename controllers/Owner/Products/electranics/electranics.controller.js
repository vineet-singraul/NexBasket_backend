const BaseProductModel = require("../../../../models/product_model/common/productBase.model.js");
const electronicsProductModel = require("../../../../models/product_model/electronics/electronicsProduct.model.js");

// Create Electronics Product
const createElectronicsProduct = async (req, res) => {
  const {
    productId,
    deviceType,
    deviceCategory,
    connectivity,
    power,
    battery,
    display,
    memory,
    processor,
    os,
    smartFeatures,
    ipRating,
    energyRating,
    sensors,
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

    if (warranty !== undefined) product.warranty = warranty;
    if (isActive !== undefined) product.isActive = isActive;
    if (warranty !== undefined || isActive !== undefined) {
      await product.save();
    }

    const electronicsProduct = await electronicsProductModel.create({
      productId,
      deviceType,
      deviceCategory,
      connectivity,
      power,
      battery,
      display,
      memory,
      processor,
      os,
      smartFeatures,
      ipRating,
      energyRating,
      sensors,
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
  const {
    deviceType,
    deviceCategory,
    connectivity,
    power,
    battery,
    display,
    memory,
    processor,
    os,
    smartFeatures,
    ipRating,
    energyRating,
    sensors,
    warranty,
    isActive,
  } = req.body;

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
    if (battery !== undefined) electronicsProduct.battery = battery;
    if (display !== undefined) electronicsProduct.display = display;
    if (memory !== undefined) electronicsProduct.memory = memory;
    if (processor !== undefined) electronicsProduct.processor = processor;
    if (os !== undefined) electronicsProduct.os = os;
    if (smartFeatures !== undefined)
      electronicsProduct.smartFeatures = smartFeatures;
    if (ipRating !== undefined) electronicsProduct.ipRating = ipRating;
    if (energyRating !== undefined)
      electronicsProduct.energyRating = energyRating;
    if (sensors !== undefined) electronicsProduct.sensors = sensors;

    await electronicsProduct.save();

    if (warranty !== undefined || isActive !== undefined) {
      const product = await BaseProductModel.findById(
        electronicsProduct.productId
      );
      if (product) {
        if (warranty !== undefined) product.warranty = warranty;
        if (isActive !== undefined) product.isActive = isActive;
        await product.save();
      }
    }

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
