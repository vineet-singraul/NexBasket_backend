const mongoose = require("mongoose");

const electronicsSpecificationSchema = new mongoose.Schema(
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

    specifications: [
      {
        name: {
          type: String,
          required: true,
          trim: true,
        },

        value: {
          type: mongoose.Schema.Types.Mixed,
          required: true,
        },

        unit: {
          type: String,
          trim: true,
          default: null,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

electronicsSpecificationSchema.index({
  productId: 1,
  variantId: 1,
});

module.exports = mongoose.model(
  "ElectronicsSpecification",
  electronicsSpecificationSchema
);