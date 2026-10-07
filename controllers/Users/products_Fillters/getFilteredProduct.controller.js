const productBase = require("../../../models/product_model/common/productBase.model.js");

const getFilteredProduct = async (req, res) => {
  const { selectedFilter } = req.params;

  if (!selectedFilter) {
    return res
      .status(400)
      .json({ success: false, message: "please select any fillter" });
  }

  try {
    const response = await productBase();

    const products = response.data;

    console.log("All Products:", products);
  } catch (error) {}
};
