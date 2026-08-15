const mongoose = require("mongoose");

const productImageSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProductBase",
      required: true,
      index: true,
    },

    variantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProductVariant",
      default: null,
      index: true,
    },

    imageUrl: {
      type: String,
      required: true,
      trim: true,
    },

    publicId: {
      type: String,
      required: true,
      trim: true,
    },

    altText: {
      type: String,
      trim: true,
      default: "",
    },

    imageType: {
      type: String,
      enum: ["product", "thumbnail", "gallery", "detail"],
      default: "gallery",
    },

    sortOrder: {
      type: Number,
      default: 0,
      min: 0,
    },

    isPrimary: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("ProductImage", productImageSchema);