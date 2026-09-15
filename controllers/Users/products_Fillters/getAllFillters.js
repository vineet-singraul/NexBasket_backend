const fillterModel = require("../../../models/product_model/filter/filterDefinition.model.js");
const baseProduct = require("../../../models/product_model/common/productBase.model.js");

const getParticulerFillter = async (req, res) => {
  const { findingKeywords } = req.params;

  if (!findingKeywords) {
    return res.status(400).json({
      success: false,
      message: "Fillter Not Found",
    });
  }

  try {
    const getFillter = await fillterModel.find({
      name: findingKeywords,
    });

    // const getData = await baseProduct.find({ 
    //   productType: findingKeywords,
    // });

    return res.status(200).json({
      success: true,
      message: "Fillter fetched successfully",
      Fillters : getFillter,
      // data : getData
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
};

module.exports = {
  getParticulerFillter,
};
