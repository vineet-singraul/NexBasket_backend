const mongoose = require("mongoose");

const productImageSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    imageUrl: {
      type: String,
      required: true,
      trim: true,
    },

    publicId: {
      type: String,
      trim: true,
    },

    isPrimary: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

const productImageModel = mongoose.model("ProductImage", productImageSchema);

module.exports = productImageModel;

