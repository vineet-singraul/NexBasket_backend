const BaseProductModel = require("../../../models/product_model/common/productBase.model.js");

// Convert HTML form/checkbox values ("on", "true", "1", ...) to a real boolean.
// Returns undefined when the value itself is undefined so schema defaults still apply.
const toBoolean = (value) => {
  if (value === undefined) return undefined;
  if (typeof value === "boolean") return value;
  if (typeof value === "string") {
    return ["true", "on", "1", "yes"].includes(value.toLowerCase());
  }
  return Boolean(value);
};

// multipart/form-data fields (tags, specifications) can only travel as strings,
// so the frontend sends them as JSON strings — parse them back into arrays here.
const parseIfJSON = (value, fallback) => {
  if (value === undefined) return fallback;
  if (typeof value !== "string") return value;
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
};

// Create Base Product — base details + SKU/variant details + pricing + inventory + specifications, all in one call
const createBaseProduct = async (req, res) => {
  const {
    // Identity
    storeId,
    title,
    slug,
    productCode,
    productType,
    categoryId,
    subcategoryId,

    // Content
    description,
    shortDescription,
    fullDescription,
    highlights,
    features,
    whatsIncluded,

    // Brand
    brand,
    manufacturer,
    modelName,
    modelNumber,
    manufacturerPartNumber,
    importerName,
    packerName,
    countryOfOrigin,

    // Compliance
    hsnCode,
    taxCode,

    // Warranty
    warranty,

    // SEO
    metaTitle,
    metaDescription,
    searchKeywords,
    tags,

    // Return
    returnPolicy,
    returnDays,

    // Status
    condition,
    status,
    visibility,
    isFeatured,
    isActive,

    // SKU / Variant Details
    sku,
    variantName,
    attributes,
    gtin,
    weight,
    dimensions,
    isDefault,

    // Pricing
    mrp,
    sellingPrice,
    discountPercent,
    costPrice,
    taxPercent,
    currency,

    // Inventory
    quantity,
    reservedQuantity,
    lowStockThreshold,
    allowBackorder,
    stockStatus,

    // Specifications
    specifications,
  } = req.body;

  try {
    const baseProduct = await BaseProductModel.create({
      // Identity
      storeId,
      title,
      slug,
      productCode,
      productType,
      categoryId,
      subcategoryId,

      // Content
      description,
      shortDescription,
      fullDescription,
      highlights: parseIfJSON(highlights, []),
      features: parseIfJSON(features, []),
      whatsIncluded: parseIfJSON(whatsIncluded, []),

      // Brand
      brand,
      manufacturer,
      modelName,
      modelNumber,
      manufacturerPartNumber,
      importerName,
      packerName,
      countryOfOrigin,

      // Compliance
      hsnCode,
      taxCode,

      // Warranty
      warranty: parseIfJSON(warranty, {}),

      // SEO
      metaTitle,
      metaDescription,
      searchKeywords: parseIfJSON(searchKeywords, []),
      tags: parseIfJSON(tags, []),

      // Return
      returnPolicy,
      returnDays,

      // Status
      condition,
      status,
      visibility,
      isFeatured: toBoolean(isFeatured),
      isActive: toBoolean(isActive),

      sku,
      variantName,
      attributes: parseIfJSON(attributes, {}),
      gtin,
      weight: parseIfJSON(weight, {}),
      dimensions: parseIfJSON(dimensions, {}),
      isDefault: toBoolean(isDefault),

      pricing: {
        mrp,
        sellingPrice,
        discountPercent,
        costPrice,
        taxPercent,
        currency,
      },

      inventory: {
        quantity,
        reservedQuantity,
        lowStockThreshold,
        allowBackorder: toBoolean(allowBackorder),
        stockStatus,
      },

      specifications: parseIfJSON(specifications, []),
    });

    return res.status(201).json({
      success: true,
      message: "Product created successfully.",
      data: baseProduct,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Product creation failed.",
      error: error.message,
    });
  }
};

module.exports = {
  createBaseProduct,
};
