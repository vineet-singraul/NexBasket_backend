const productBase = require("../../../models/product_model/common/productBase.model.js");
const filterDefinition = require("../../../models/product_model/filter/filterDefinition.model.js");

// Filter keys that do not match the product field name directly
const KEY_ALIASES = {
  price: "pricing.sellingPrice",
};

const escapeRegex = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// Query values are always strings, but attributes/specifications can store numbers
const withNumbers = (values) =>
  values.flatMap((value) => (isNaN(value) ? [value] : [value, Number(value)]));

// Convert the selected value into a mongo condition based on the filter type
const buildValueCondition = (filter, rawValue) => {
  const text = Array.isArray(rawValue) ? rawValue.join(",") : String(rawValue);

  // range : 1000-5000 | 1000- | -5000
  if (filter.type === "range") {
    const match = text.match(/^\s*(\d*\.?\d*)\s*-\s*(\d*\.?\d*)\s*$/);
    if (!match) return null;

    const condition = {};
    if (match[1] !== "") condition.$gte = Number(match[1]);
    if (match[2] !== "") condition.$lte = Number(match[2]);

    return Object.keys(condition).length ? condition : null;
  }

  // boolean : true | false
  if (filter.type === "boolean") {
    if (text !== "true" && text !== "false") return null;
    return { $in: [text === "true", text] };
  }

  // checkbox / radio : Samsung,Apple
  const values = text
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);

  return values.length ? { $in: withNumbers(values) } : null;
};

// Find where the key lives : product field, attributes or specifications
const buildFieldCondition = (key, condition) => {
  const path = KEY_ALIASES[key] || key;

  if (productBase.schema.path(path)) {
    return { [path]: condition };
  }

  return {
    $or: [
      { [`attributes.${key}`]: condition },
      { specifications: { $elemMatch: { name: key, value: condition } } },
    ],
  };
};

const getFilteredProduct = async (req, res) => {
  const { filterOption } = req.params;

  if (!filterOption) {
    return res
      .status(400)
      .json({ success: false, message: "please select any fillter" });
  }

  try {
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit) || 20, 1), 100);

    const definition = await filterDefinition.findOne({
      productType: filterOption.toLowerCase(),
    });

    const conditions = [
      { productType: new RegExp(`^${escapeRegex(filterOption)}$`, "i") },
      { isActive: true },
    ];
    const appliedFilters = {};

    // Only the keys defined by the admin for this product type are applied
    for (const filter of definition?.filters || []) {
      const rawValue = req.query[filter.key];

      if (rawValue === undefined || rawValue === "") continue;
      if (typeof rawValue === "object" && !Array.isArray(rawValue)) continue;

      const condition = buildValueCondition(filter, rawValue);
      if (!condition) continue;

      conditions.push(buildFieldCondition(filter.key, condition));
      appliedFilters[filter.key] = rawValue;
    }

    const query = { $and: conditions };

    const [products, total] = await Promise.all([
      productBase
        .find(query)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
      productBase.countDocuments(query),
    ]);

    return res.status(200).json({
      success: true,
      message: "Filtered products fetched successfully",
      appliedFilters,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      data: products,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getFilteredProduct };
