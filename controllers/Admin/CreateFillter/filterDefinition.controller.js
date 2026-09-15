const filterDefinition = require("../../../models/product_model/filter/filterDefinition.model.js");

// Create the Fillter :
const createFillters = async (req, res) => {
  try {
    const { name, productType, filters } = req.body;

    if (!name || !productType || !filters?.length) {
      return res.status(400).json({
        success: false,
        message: "name, productType and filters are required",
      });
    }

    const existingFilter = await filterDefinition.findOne({
      productType: productType.toLowerCase(),
    });

    if (existingFilter) {
      return res.status(400).json({
        success: false,
        message: "Filter already exists for this product type",
      });
    }

    const createNewFillter = await filterDefinition.create({
      name,
      productType: productType.toLowerCase(),
      filters,
    });

    return res.status(201).json({
      success: true,
      message: "Filter created successfully",
      data: createNewFillter,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to create filter",
      error: error.message,
    });
  }
};



module.exports = {createFillters} 