const categoryModel = require("../../../models/product_model/category/category.model.js");

const ShowAllCategoryToUser = async (req, res) => {
  try {
    const category = await categoryModel.find({ isActive: true });
    return res
      .status(201)
      .json({
        success: true,
        message: "all category get successfuly",
        Category: category,
      });
  } catch (error) {
    return res
      .status(401)
      .json({ success: false, message: "sometginh went wrong" });
  }
};

const getSingleCategoryByItsOwnId = async (req, res) => {
  const { categoryId } = req.params;
  if (!categoryId) {
    return res
      .status(400)
      .json({ success: false, message: "Category not found" });
  }

  try {
    const singleCategory = await categoryModel.findById(categoryId);

    if (!singleCategory) {
      return res
        .status(404)
        .json({ success: false, message: "Category not found" });
    }

    return res
      .status(200)
      .json({
        success: true,
        data: singleCategory,
        message: "found category successfuly",
      });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "something went wrong" });
  }
};

module.exports = { ShowAllCategoryToUser , getSingleCategoryByItsOwnId };
