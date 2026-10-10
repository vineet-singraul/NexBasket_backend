const productModel = require("../../../models/product_model/common/productBase.model");
const imageModel = require("../../../models/product_model/common/productImage.model");
const categoryModel = require("../../../models/product_model/category/category.model.js");

const getUserHomePageDetails = async (req, res) => {
  try {
    const dashboardDetails = await productModel.find({ isActive: true });

    const productIds = dashboardDetails.map((product) => product._id);
    const categoryIds = dashboardDetails.map((product) => product.categoryId);

    const [images, categories] = await Promise.all([
      imageModel.find({ productId: { $in: productIds } }),
      categoryModel.find({ _id: { $in: categoryIds } }),
    ]);

    const AllData = dashboardDetails.map((product) => {
      const productImages = images.filter(
        (image) => String(image.productId) === String(product._id),
      );
      const category = categories.find(
        (category) => String(category._id) === String(product.categoryId),
      );
      return {
        ...product.toObject(),
        images: productImages,
        category: category,
      };
    });

    const categoryMatchesAny = (product, keywords) => {
      const name = (product.category?.name || "").toLowerCase();
      const slug = (product.category?.slug || "").toLowerCase();
      return keywords.some(
        (keyword) => name.includes(keyword) || slug.includes(keyword),
      );
    };

    const electranics = AllData.filter((product) =>
      categoryMatchesAny(product, ["electr"]),
    ).slice(0, 4);
    const womans = AllData.filter((product) =>
      categoryMatchesAny(product, ["woman", "women"]),
    ).slice(0, 4);
    const mans = AllData.filter(
      (product) =>
        categoryMatchesAny(product, ["man", "men"]) &&
        !categoryMatchesAny(product, ["woman", "women"]),
    ).slice(0, 4);
    const grocery = AllData.filter((product) =>
      categoryMatchesAny(product, ["Grocery", "grocery"]),
    ).slice(0, 4);
    return res.status(200).json({
      success: true,
      message: "fetched all product details",
      data: AllData,
      Electranics: electranics,
      Mans: mans,
      Womans: womans,
      Grocery: grocery,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "server error !! could not fetch details !! try later",
    });
  }
};

const getSingleProductDetails = async (req, res) => {
  const { productId } = req.params;

  if (!productId) {
    return res
      .status(400)
      .json({ success: false, message: "Some went wrong ! try latter " });
  }

  try {
    const product = await productModel.findById({ _id: productId });
    const images = await imageModel.find({ productId });

    if (!product) {
      return res
        .status(400)
        .json({ success: false, message: "product not found" });
    }

    return res.status(201).json({
      success: true,
      message: "Product found succesfully",
      data: { ...product, images },
    });
  } catch (error) {
    return res
      .status(401)
      .json({ success: false, message: "some thing went wrong" });
  }
};

const getProductsByCategotyId = async (req, res) => {
  const { categoryId } = req.params;

  if (!categoryId) {
    return res
      .status(400)
      .json({ success: false, message: "some thing went wrong" });
  }

  try {
    const products = await productModel.find({ categoryId, isActive: true });

    const productIds = products.map((product) => product._id);
    const images = await imageModel.find({ productId: { $in: productIds } });

    const data = products.map((product) => {
      const productImages = images.filter(
        (image) => String(image.productId) === String(product._id),
      );
      return {
        ...product.toObject(),
        images: productImages,
      };
    });

    return res.status(200).json({
      success: true,
      message: "find all product succesfully",
      data,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "some thing went wrong" });
  }
};

module.exports = {
  getUserHomePageDetails,
  getSingleProductDetails,
  getProductsByCategotyId,
};
