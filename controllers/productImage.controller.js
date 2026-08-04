const productModel = require("../models/product.model.js");
const productImageModel = require("../models/productImage.model.js");
const {
  uploadBufferToCloudinary,
  deleteFromCloudinary,
} = require("../utils/cloudinary.util.js");

const addProductImages = async (req, res) => {
  try {
    const { productId } = req.params;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required.",
      });
    }

    const product = await productModel.findById(productId);

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
      productId: productId,
    });

    const imageDocs = uploadResults.map((result, index) => ({
      productId: productId,
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
    console.error("Add Product Images Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to upload product images",
    });
  }
};




const getProductImageById = async (req, res) => {
  try {
    const { productId } = req.params;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "Product is not created please create fist product",
      });
    }

    const images = await productImageModel.find({ productId });

    return res.status(200).json({
      success: true,
      message: "Product images fetched successfully",
      data: images,
    });
  } catch (error) {
    return res.status(200).json({
      success: false,
      message: error.message || "Failed to fetch product images",
    });
  }
};



const deleteProductById = async (req, res) => {
  try {
    const { productId } = req.params;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required.",
      });
    }

    const deletedImage = await productImageModel.findByIdAndDelete(productId);

    if (!deletedImage) {
      return res.status(404).json({
        success: false,
        message: "Image not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Product image deleted successfully.",
      data: deletedImage,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = { addProductImages, getProductImageById, deleteProductById };
