const BaseProductModel = require("../../../models/product_model/common/productBase.model.js");
const Store = require("../../../models/store_model/store.model.js");
const ProductImageModel = require("../../../models/product_model/common/productImage.model.js");
const productImageModel = require("../../../models/product_model/common/productImage.model.js");
const ProductCategoryModel = require("../../../models/product_model/category/category.model.js");
const ProductMainDetails = require("../../../models/product_model/electronics/electronicsProduct.model.js");

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
    const CompleteProduct = [];
    const ownerDashboardDetails = await BaseProductModel.find({ storeId });
    const productCount = ownerDashboardDetails.length;

    for (const product of ownerDashboardDetails) {
      // const productCategoryId = product.categoryId;
      // const findCatecury =
      //   await ProductCategoryModel.findById(productCategoryId);

      // if (
      //   findCatecury &&
      //   productCategoryId.equals(findCatecury._id) &&
      //   findCatecury.name == "Electranics"
      // ) {
      //   const findMainModelData = await ProductMainDetails.findOne({
      //     productId: product._id,
      //   });
      //   console.log("<---->", findMainModelData);
      // } else {
      //   console.log("byyyyy");
      // }
      const image = await productImageModel.find({ productId: product._id });
      const imageCount = image.length;
      CompleteProduct.push({
        ...product.toObject(),
        images: image,
        count: imageCount,
      });
    }

    const listedStore = await Store.find({ owner: ownerId });
    const storeCount = listedStore.length;

    return res.status(201).json({
      success: true,
      message: "get owner dashboard data succesfully",
      productCount: productCount,
      storeCount: storeCount,
      listedStore: listedStore,
      ListedProduct: CompleteProduct,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error | "Owner ID is not defined",
    });
  }
};

module.exports = { getOwnerDashbordDetils };  