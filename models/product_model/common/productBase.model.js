const mongoose = require("mongoose");

const productBaseSchema = new mongoose.Schema(
  {
    // ---------- Base Details ----------
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

    // ---------- SKU / Variant Details ----------
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

    // ---------- Pricing Details ----------
    pricing: {
      mrp: {
        type: Number,
        min: 0,
      },

      sellingPrice: {
        type: Number,
        min: 0,
      },

      discountPercent: {
        type: Number,
        min: 0,
        max: 100,
        default: 0,
      },

      costPrice: {
        type: Number,
        min: 0,
      },

      taxPercent: {
        type: Number,
        min: 0,
        default: 0,
      },

      currency: {
        type: String,
        trim: true,
        default: "INR",
      },
    },

    // ---------- Inventory Details ----------
    inventory: {
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
        enum: ["in_stock", "low_stock", "out_of_stock", "backorder"],
        default: "out_of_stock",
      },
    },

    // ---------- Specification Details ----------
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
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

productBaseSchema.virtual("availableQuantity").get(function () {
  return Math.max(
    this.inventory.quantity - this.inventory.reservedQuantity,
    0
  );
});

module.exports = mongoose.model("ProductBase", productBaseSchema);
