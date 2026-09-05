const mongoose = require("mongoose");

const productBaseSchema = new mongoose.Schema(
  {
    // ---------- Identity ----------
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

    productCode: {
      type: String,
      trim: true,
      unique: true,
      sparse: true,
      index: true,
    },

    productType: {
      type: String,
      trim: true,
      index: true,
    },

    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
      index: true,
    },

    // ---------- Content ----------
    description: {
      type: String,
      trim: true,
    },

    shortDescription: {
      type: String,
      trim: true,
    },

    fullDescription: {
      type: String,
      trim: true,
    },

    highlights: [
      {
        type: String,
        trim: true,
      },
    ],

    features: [
      {
        type: String,
        trim: true,
      },
    ],

    whatsIncluded: [
      {
        type: String,
        trim: true,
      },
    ],

    // ---------- Brand ----------
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

    manufacturerPartNumber: {
      type: String,
      trim: true,
    },

    importerName: {
      type: String,
      trim: true,
    },

    packerName: {
      type: String,
      trim: true,
    },

    countryOfOrigin: {
      type: String,
      trim: true,
    },

    // ---------- Compliance ----------
    hsnCode: {
      type: String,
      trim: true,
      index: true,
    },

    taxCode: {
      type: String,
      trim: true,
    },

    // ---------- Warranty ----------
    warranty: {
      duration: {
        type: Number,
        min: 0,
      },

      unit: {
        type: String,
        enum: ["days", "months", "years"],
      },

      type: {
        type: String,
        enum: ["manufacturer", "seller", "brand", "no_warranty"],
      },

      description: {
        type: String,
        trim: true,
      },
    },

    // ---------- SEO ----------
    metaTitle: {
      type: String,
      trim: true,
    },

    metaDescription: {
      type: String,
      trim: true,
    },

    searchKeywords: [
      {
        type: String,
        trim: true,
      },
    ],

    tags: [
      {
        type: String,
        trim: true,
      },
    ],

    // ---------- Return ----------

    isReturnable : {
      type:Boolean
    },

    returnPolicy: {
      type: String,
      trim: true,
    },

    returnDays: {
      type: Number,
      min: 0,
      default: 0,
    },

    // ---------- Status ----------
    condition: {
      type: String,
      enum: ["new", "used", "refurbished"],
      default: "new",
    },

    status: {
      type: String,
      enum: ["draft", "active", "inactive", "blocked", "archived"],
      default: "draft",
      index: true,
    },

    visibility: {
      type: String,
      enum: ["public", "private", "hidden"],
      default: "public",
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

    isProductListtingComplete : {
      type:Boolean,
      default:false
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

    // ----------------- Check : tht image or actual product uploaded or Not --------------------------
    isImageUploaded : {
      type:Boolean,
      default:false
    },

    isUploadedActualProduct : {
      type:Boolean,
      default:false
    }
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
