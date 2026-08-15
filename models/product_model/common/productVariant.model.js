const mongoose = require("mongoose");

const productVariantSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProductBase",
      required: true,
      index: true,
    },

    sku: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },

    variantName: {
      type: String,
      trim: true,
    },

    attributes: {
      type: Map,
      of: mongoose.Schema.Types.Mixed,
      default: {},
    },
    
    gtin: {
      type: String,
      trim: true,
    },

    weight: {
      value: {
        type: Number,
        min: 0,
      },

      unit: {
        type: String,
        enum: ["mg", "g", "kg", "oz", "lb"],
        default: "g",
      },
    },

    dimensions: {
      length: {
        type: Number,
        min: 0,
      },

      width: {
        type: Number,
        min: 0,
      },

      height: {
        type: Number,
        min: 0,
      },

      unit: {
        type: String,
        enum: ["mm", "cm", "m", "in", "ft"],
        default: "cm",
      },
    },

    isDefault: {
      type: Boolean,
      default: false,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("ProductVariant", productVariantSchema);