const mongoose = require("mongoose");

const productBaseSchema = new mongoose.Schema(
  {
    storeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Seller",
      required: true,
      index: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      trim: true,
      lowercase: true,
      unique: true,
      index: true,
    },

    description: {
      type: String,
      trim: true,
    },

    shortDescription: {
      type: String,
      trim: true,
    },

    brand: {
      type: String,
      trim: true,
      index: true,
    },

    manufacturer: {
      type: String,
      trim: true,
    },

    modelName: {
      type: String,
      trim: true,
    },

    modelNumber: {
      type: String,
      trim: true,
    },

    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
      index: true,
    },

    // productTypeId: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "ProductType",
    //   index: true,
    // },

    countryOfOrigin: {
      type: String,
      trim: true,
    },

    tags: [
      {
        type: String,
        trim: true,
      },
    ],

    status: {
      type: String,
      enum: ["draft", "active", "inactive", "blocked", "archived"],
      default: "draft",
      index: true,
    },

    isFeatured: {
      type: Boolean,
      default: false,
    },

    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("ProductBase", productBaseSchema);