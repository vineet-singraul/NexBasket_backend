const mongoose = require("mongoose");

const productInventorySchema = new mongoose.Schema(
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
      index: true,
    },

    warehouseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Warehouse",
      index: true,
    },

    quantity: {
      type: Number,
      default: 0,
      min: 0,
    },

    reservedQuantity: {
      type: Number,
      default: 0,
      min: 0,
    },

    lowStockThreshold: {
      type: Number,
      default: 5,
      min: 0,
    },

    allowBackorder: {
      type: Boolean,
      default: false,
    },

    stockStatus: {
      type: String,
      enum: [
        "in_stock",
        "low_stock",
        "out_of_stock",
        "backorder",
      ],
      default: "out_of_stock",
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

productInventorySchema.virtual("availableQuantity").get(function () {
  return Math.max(this.quantity - this.reservedQuantity, 0);
});

productInventorySchema.set("toJSON", {
  virtuals: true,
});

productInventorySchema.set("toObject", {
  virtuals: true,
});

module.exports = mongoose.model(
  "ProductInventory",
  productInventorySchema
);