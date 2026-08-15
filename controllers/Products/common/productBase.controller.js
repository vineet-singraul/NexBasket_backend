const BaseProductModel = require("../../../models/product_model/common/productBase.model.js");
const productVariantModel = require("../../../models/product_model/common/productVariant.model.js");
const productInventoryModel = require("../../../models/product_model/common/productInventory.model.js");
const productImageModel = require("../../../models/product_model/common/productImage.model.js");
const productSpecificationModel = require("../../../models/product_model/common/productSpecification.model.js");
const {
  uploadBufferToCloudinary,
  deleteFromCloudinary,
} = require("../../../utils/cloudinary.util.js");

// Create Base Product
const createBaseProduct = async (req, res) => {
  const {
    storeId,
    title,
    slug,
    description,
    shortDescription,
    brand,
    manufacturer,
    modelName,
    modelNumber,
    categoryId,
    countryOfOrigin,
    tags,
    status,
    isFeatured,
    isActive,
  } = req.body;

  try {
    const baseProduct = await BaseProductModel.create({
      storeId,
      title,
      slug,
      description,
      shortDescription,
      brand,
      manufacturer,
      modelName,
      modelNumber,
      categoryId,
      countryOfOrigin,
      tags,
      status,
      isFeatured,
      isActive,
    });

    return res.status(201).json({
      success: true,
      message: "Base product created successfully.",
      data: baseProduct,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Base product creation failed.",
      error: error.message,
    });
  }
};

// Create Product Variant
const createProductVariant = async (req, res) => {
  const {
    productId,
    sku,
    variantName,
    attributes,
    gtin,
    weight,
    dimensions,
    isDefault,
    isActive,
  } = req.body;

  try {
    const variant = await productVariantModel.create({
      productId,
      sku,
      variantName,
      attributes,
      gtin,
      weight,
      dimensions,
      isDefault,
      isActive,
    });

    return res.status(201).json({
      success: true,
      message: "Variant created successfully.",
      data: variant,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to create variant.",
      error: error.message,
    });
  }
};

// Create Product Inventory
const createProductInventory = async (req, res) => {
  const {
    productId,
    variantId,
    quantity,
    reservedQuantity,
    lowStockThreshold,
    allowBackorder,
    stockStatus,
  } = req.body;

  try {
    const inventory = await productInventoryModel.create({
      productId,
      variantId,
      quantity,
      reservedQuantity,
      lowStockThreshold,
      allowBackorder,
      stockStatus,
    });

    return res.status(201).json({
      success: true,
      message: "Inventory created successfully.",
      data: inventory,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to create inventory.",
      error: error.message,
    });
  }
};

// Add Multiple Product Images
const addProductImages = async (req, res) => {
  const { productId } = req.params;
  const { variantId } = req.body;

  try {
    const product = await BaseProductModel.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    const files = req.files;

    if (!files || !files.length) {
      return res.status(400).json({
        success: false,
        message: "At least one image is required.",
      });
    }

    const uploadResults = await Promise.all(
      files.map((file) => uploadBufferToCloudinary(file.buffer, "products")),
    );

    const existingImagesCount = await productImageModel.countDocuments({
      productId,
    });

    const imageDocs = uploadResults.map((result, index) => ({
      productId,
      variantId: variantId || null,
      imageUrl: result.secure_url,
      publicId: result.public_id,
      isPrimary: existingImagesCount === 0 && index === 0,
    }));

    const savedImages = await productImageModel.insertMany(imageDocs);

    return res.status(201).json({
      success: true,
      message: "Product images uploaded successfully.",
      data: savedImages,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to upload product images.",
      error: error.message,
    });
  }
};

// Get Product Images
const getProductImages = async (req, res) => {
  const { productId } = req.params;

  try {
    const images = await productImageModel
      .find({ productId })
      .sort({ sortOrder: 1 });

    return res.status(200).json({
      success: true,
      message: "Product images fetched successfully.",
      count: images.length,
      data: images,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch product images.",
      error: error.message,
    });
  }
};

// Delete Product Image
const deleteProductImage = async (req, res) => {
  const { imageId } = req.params;

  try {
    const image = await productImageModel.findById(imageId); 

    if (!image) {
      return res.status(404).json({
        success: false,
        message: "Image not found.",
      });
    }

    await deleteFromCloudinary(image.publicId);
    await productImageModel.findByIdAndDelete(imageId);

    return res.status(200).json({
      success: true,
      message: "Product image deleted successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete product image.",
      error: error.message,
    });
  }
};

// Add Product Specification
const addProductSpecification = async (req, res) => {
  const { productId, variantId, specifications } = req.body;

  try {
    if (!productId || !specifications || !specifications.length) {
      return res.status(400).json({
        success: false,
        message: "Product ID and at least one specification are required.",
      });
    }

    const product = await BaseProductModel.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    const specification = await productSpecificationModel.create({
      productId,
      variantId: variantId || null,
      specifications,
    });

    return res.status(201).json({
      success: true,
      message: "Product specification added successfully.",
      data: specification,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to add product specification.",
      error: error.message,
    });
  }
};

// Get Product Specifications
const getProductSpecifications = async (req, res) => {
  const { productId } = req.params;

  try {
    const specifications = await productSpecificationModel.find({
      productId,
    });

    return res.status(200).json({
      success: true,
      message: "Product specifications fetched successfully.",
      count: specifications.length,
      data: specifications,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch product specifications.",
      error: error.message,
    });
  }
};

module.exports = {
  createBaseProduct,
  createProductVariant,
  createProductInventory,
  addProductImages,
  getProductImages,
  deleteProductImage,
  addProductSpecification,
  getProductSpecifications,
};
  