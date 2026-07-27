const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    OwnerId: {
      type: String,
      required: true,
      trim: true,
    },
    MainOwnerName: {
      type: String,
      required: true,
      trim: true,
    },
    productCategory: {
      type: String,
      required: true,
      trim: true,
    },
    categoryDescription: {
      type: String,
      required: true,
      trim: true,
    },
    categoryActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Category", categorySchema);