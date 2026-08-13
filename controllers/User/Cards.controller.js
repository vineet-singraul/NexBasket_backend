const productModel = require("../../models/product_model/product.model.js");
const imagesModel = require("../../models/product_model/productImage.model.js");


const getAllCards = async (req, res) => {
  try {
    const products = await productModel.find({ isActive: true }).lean();

    const productIds = products.map((product) => product._id);

    const images = await imagesModel
      .find({ productId: { $in: productIds } })
      .lean();

    const cards = products.map((product) => ({
      ...product,
      images: images.filter(
        (image) => image.productId.toString() === product._id.toString()
      ),
    }));

    return res.status(200).json({
      success: true,
      count: cards.length,
      data: cards,
    });
  } catch (error) {
    console.error("Error in getAllCards:", error.message);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while fetching cards",
    });
  }
};







module.exports = {getAllCards}