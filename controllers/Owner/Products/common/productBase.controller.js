const BaseProductModel = require("../../../../models/product_model/common/productBase.model.js");

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



const editBaseProduct = async (req, res) => {
  
  const { productId } = req.params;

  if (!productId) {
    return res.status(400).json({success:false, message:"product is not found ..... "})
  }

  try {
    const findedProduct = await BaseProductModel.findById(productId);
    if (!findedProduct) {
      return res.status(404).json({ success: false, message: "Product is not found ..... " });
    }

    const {
      title = findedProduct.title,
      description = findedProduct.description,
      shortDescription = findedProduct.shortDescription,
      fullDescription = findedProduct.fullDescription,
      highlights = findedProduct.highlights,
      features = findedProduct.features,
      whatsIncluded = findedProduct.whatsIncluded,
      brand = findedProduct.brand,
      manufacturer = findedProduct.manufacturer,
      modelName = findedProduct.modelName,
      modelNumber = findedProduct.modelNumber,
      manufacturerPartNumber = findedProduct.manufacturerPartNumber,
      importerName = findedProduct.importerName,
      packerName = findedProduct.packerName,
      countryOfOrigin = findedProduct.countryOfOrigin,
      hsnCode = findedProduct.hsnCode,
      taxCode = findedProduct.taxCode,
      warranty = findedProduct.warranty,
      metaTitle = findedProduct.metaTitle,
      metaDescription = findedProduct.metaDescription,
      searchKeywords = findedProduct.searchKeywords,
      tags = findedProduct.tags,
      returnPolicy = findedProduct.returnPolicy,
      returnDays = findedProduct.returnDays,
      productType = findedProduct.productType,
      condition = findedProduct.condition,
      status = findedProduct.status,
      visibility = findedProduct.visibility,
      isFeatured = findedProduct.isFeatured,
      isActive = findedProduct.isActive,
      sku = findedProduct.sku,
      variantName = findedProduct.variantName,
      attributes = findedProduct.attributes,
      gtin = findedProduct.gtin,
      weight = findedProduct.weight,
      dimensions = findedProduct.dimensions,
      isDefault = findedProduct.isDefault,
      mrp = findedProduct.pricing?.mrp,
      sellingPrice = findedProduct.pricing?.sellingPrice,
      discountPercent = findedProduct.pricing?.discountPercent,
      costPrice = findedProduct.pricing?.costPrice,
      taxPercent = findedProduct.pricing?.taxPercent,
      currency = findedProduct.pricing?.currency,
      quantity = findedProduct.inventory?.quantity,
      reservedQuantity = findedProduct.inventory?.reservedQuantity,
      lowStockThreshold = findedProduct.inventory?.lowStockThreshold,
      allowBackorder = findedProduct.inventory?.allowBackorder,
      stockStatus = findedProduct.inventory?.stockStatus,
    } = req.body;

    findedProduct.title = title;
    findedProduct.description = description;
    findedProduct.shortDescription = shortDescription;
    findedProduct.fullDescription = fullDescription;
    findedProduct.highlights = parseIfJSON(highlights, findedProduct.highlights);
    findedProduct.features = parseIfJSON(features, findedProduct.features);
    findedProduct.whatsIncluded = parseIfJSON(whatsIncluded, findedProduct.whatsIncluded);

    findedProduct.brand = brand;
    findedProduct.manufacturer = manufacturer;
    findedProduct.modelName = modelName;
    findedProduct.modelNumber = modelNumber;
    findedProduct.manufacturerPartNumber = manufacturerPartNumber;
    findedProduct.importerName = importerName;
    findedProduct.packerName = packerName;
    findedProduct.countryOfOrigin = countryOfOrigin;

    findedProduct.hsnCode = hsnCode;
    findedProduct.taxCode = taxCode;

    findedProduct.warranty = parseIfJSON(warranty, findedProduct.warranty);

    findedProduct.metaTitle = metaTitle;
    findedProduct.metaDescription = metaDescription;
    findedProduct.searchKeywords = parseIfJSON(searchKeywords, findedProduct.searchKeywords);
    findedProduct.tags = parseIfJSON(tags, findedProduct.tags);

    findedProduct.returnPolicy = returnPolicy;
    findedProduct.returnDays = returnDays;

    findedProduct.productType = productType;
    findedProduct.condition = condition;
    findedProduct.status = status;
    findedProduct.visibility = visibility;
    findedProduct.isFeatured = toBoolean(isFeatured) ?? isFeatured;
    findedProduct.isActive = toBoolean(isActive) ?? isActive;

    findedProduct.sku = sku;
    findedProduct.variantName = variantName;
    findedProduct.attributes = parseIfJSON(attributes, findedProduct.attributes);
    findedProduct.gtin = gtin;
    findedProduct.weight = parseIfJSON(weight, findedProduct.weight);
    findedProduct.dimensions = parseIfJSON(dimensions, findedProduct.dimensions);
    findedProduct.isDefault = toBoolean(isDefault) ?? isDefault;

    findedProduct.pricing = {
      mrp,
      sellingPrice,
      discountPercent,
      costPrice,
      taxPercent,
      currency,
    };

    findedProduct.inventory = {
      quantity,
      reservedQuantity,
      lowStockThreshold,
      allowBackorder: toBoolean(allowBackorder) ?? allowBackorder,
      stockStatus,
    };

    const updatedProduct = await findedProduct.save();

    return res.status(200).json({
      success: true,
      message: "Product updated successfully.",
      data: updatedProduct,
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }

}

const deleteBaseProduct = async (req, res) => {
  const { productId } = req.params;

  if (!productId) {
    return res.status(400).json({
      success: false,
      message: "Product ID is required",
    });
  }

  try {
    const product = await BaseProductModel.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    await BaseProductModel.findByIdAndDelete(productId);

    return res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("Delete product error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete product",
      error: error.message,
    });
  }
};



module.exports = {
  createBaseProduct, editBaseProduct, deleteBaseProduct
};
