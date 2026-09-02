const BaseProductModel = require("../../../../models/product_model/common/productBase.model.js");
const productImageModel = require("../../../../models/product_model/common/productImage.model.js");
const {
  uploadBufferToCloudinary,
  deleteFromCloudinary,
} = require("../../../../utils/cloudinary.util.js");

// Add Multiple Product Images
const addProductImages = async (req, res) => {
  const { productId } = req.params;

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

module.exports = {
  addProductImages,
  getProductImages,
  deleteProductImage,
};
