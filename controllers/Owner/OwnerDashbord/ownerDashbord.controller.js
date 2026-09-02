const BaseProductModel = require("../../../models/product_model/common/productBase.model.js");
const Store = require("../../../models/store_model/store.model.js");

const getOwnerDashbordDetils = async (req, res) => {
  const { storeId } = req.params;
  if (!storeId) {
    return res.status(400).json({
      success: false,
      message: "Store is not found",
    });
  }

  const { ownerId } = req.params;

  if (!ownerId) {
    return res.status(400).json({
      success: false,
      message: "Owner is not found",
    });
  }

  try {
    const ownerDashboardDetails = await BaseProductModel.find({ storeId });
    const productCount = ownerDashboardDetails.length;

    const listedStore = await Store.find({ owner: ownerId });
    const storeCount = listedStore.length;

    return res
      .status(201)
      .json({
        success: true,
        message: "get owner dashboard data succesfully",
        productCount: productCount,
        storeCount:storeCount,
        ListedProduct: ownerDashboardDetails,
        listedStore: listedStore
      });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error | "Owner ID is not defined",
    });
  }
};

module.exports = { getOwnerDashbordDetils };
