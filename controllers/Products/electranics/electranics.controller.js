const BaseProductModel = require("../../../models/product_model/A_Common_product/productBase.model.js");
const productInventryModel = require("../../../models/product_model/A_Common_product/productInventory.model.js");
const productImagesModel = require("../../../models/product_model/A_Common_product/productImage.model.js");
const productPriceModel = require("../../../models/product_model/A_Common_product/productPricing.model.js");
const productVarientModel = require("../../../models/product_model/A_Common_product/productVariant.model.js");
const electranicProduct = require("../../../models/product_model/electronics/electronicsProduct.model.js");
const electranicSpecificationProduct = require("../../../models/product_model/electronics/electronicsSpecification.model.js");

const creatElectranicBaseProduct = async (req, res) => {
  const {
    storeId,
    title,
    slug,
    description,
    shortDescription,
    brand,
    manufacturer,
    modelName,
    modelNumber,
    categoryId,
    productTypeId,
    countryOfOrigin,
    tags,
    status,
    isFeatured,
    isActive,
  } = req.body;

  try {
    const baseProductCreation = await BaseProductModel.create({
      storeId,
      title,
      slug,
      description,
      shortDescription,
      brand,
      manufacturer,
      modelName,
      modelNumber,
      categoryId,
      countryOfOrigin,
      tags,
      status,
      isFeatured,
      isActive,
    });

    return res.status(200).json({
        sucess:true,
        message:"Base product creation sucessfully"
    })
  } catch (error) {
    return res.status(400).json({
        sucess:false,
        message: error || "Product creation failed"
    })
  }
};



module.exports = {creatElectranicBaseProduct}