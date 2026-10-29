const mongoose = require("mongoose");
const productModel = require("../../../models/product_model/common/productBase.model");
const imageModel = require("../../../models/product_model/common/productImage.model");
const categoryModel = require("../../../models/product_model/category/category.model.js");
const AddToWishListModel = require("../../../models/product_model/common/addToWishlist.model.js");
const userModel = require("../../../models/auth_model/user.model.js");
const AddToCartModel = require("../../../models/product_model/common/addToCart.model.js");
const { emitCartCount } = require("../../../config/socket.js");

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

// const searchProduct = async (req, res) => {
//   const { searchKey } = req.params;

//   if (!searchKey) {
//     return res
//       .status(400)
//       .json({ success: true, message: "some thing went wrong" });
//   }

//   try {
//     const product = await productModel.find({ searchKeywords: searchKey });
//     return res.status(200).json({success:true,message:"search product successfully",data:product});
//   } catch (error) {
//     return res.status(400).json({success:false,message:"some thing went wrong"})
//   }
// };

const searchProduct = async (req, res) => {
  const { searchKey } = req.params;

  if (!searchKey || !searchKey.trim()) {
    return res.status(400).json({
      success: false,
      message: "Search keyword is required",
    });
  }

  try {
    // Escape special regex characters
    const escapedSearchKey = searchKey
      .trim()
      .replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    const products = await productModel
      .find({
        searchKeywords: {
          $regex: escapedSearchKey,
          $options: "i",
        },
      })
      .limit(8);

    const productIds = products.map((product) => product._id);
    const categoryIds = products.map((product) => product.categoryId);

    const [images, categories] = await Promise.all([
      imageModel.find({ productId: { $in: productIds } }),
      categoryModel.find({ _id: { $in: categoryIds } }),
    ]);

    const data = products.map((product) => {
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

    return res.status(200).json({
      success: true,
      message: "Products searched successfully",
      data,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

const AddToWishList = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.user._id;

    if (!productId) {
      return res
        .status(400)
        .json({ success: false, message: "productId is required" });
    }

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid productId" });
    }

    const isProductExist = await AddToWishListModel.findOne({
      userId,
      productId,
    });

    if (isProductExist) {
      return res
        .status(409)
        .json({ success: false, message: "Product already in wishlist" });
    }

    const product = await AddToWishListModel.create({
      productId,
      userId,
      quantity,
    });

    return res.status(201).json({
      success: true,
      message: "Product added to wishlist successfully",
      data: product,
    });
  } catch (error) {
    // unique index (userId + productId) hit by a concurrent request
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Product already in wishlist",
        code: 409,
      });
    }
    console.error("AddToWishList error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Something went wrong" });
  }
};

const ShowWishList = async (req, res) => {
  const { userId } = req.params;
  if (!userId) {
    return res
      .status(401)
      .json({ success: false, message: "session is expired" });
  }

  try {
    const wishlist = await AddToWishListModel.find({ userId }).select(
      "productId",
    );
    if (wishlist.length === 0) {
      return res.status(200).json({
        success: true,
        message: "wishlist is empty !! please add product",
        data: [],
      });
    }

    const productIds = wishlist.map((item) => item.productId);

    const [products, images] = await Promise.all([
      productModel.find({ _id: { $in: productIds } }),
      imageModel.find({ productId: { $in: productIds } }),
    ]);

    const list = products.map((product) => {
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
      message: "product found successfully",
      count: wishlist.length,
      data: list,
    });
  } catch (error) {
    console.error("ShowWishList error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Something went wrong" });
  }
};

const DeleteWishList = async (req, res) => {
  try {
    const { userId, productId } = req.body;

    if (!userId || !productId) {
      return res.status(400).json({
        success: false,
        message: "userId and productId are required.",
      });
    }

    const isUserExist = await userModel.findById(userId);

    if (!isUserExist) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    const isProductExist = await AddToWishListModel.findOne({
      userId,
      productId,
    });

    if (!isProductExist) {
      return res.status(404).json({
        success: false,
        message: "Product not found in wishlist.",
      });
    }

    await isProductExist.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Product removed from wishlist successfully.",
    });
  } catch (error) {
    console.error("DeleteWishList Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error.",
      error: error.message,
    });
  }
};

const AddToCart = async (req, res) => {
  const { productId, userId, quantity } = req.body;
  if (!productId || !userId) {
    return res
      .status(400)
      .json({ success: false, message: "user id or product id is require." });
  }

  try {
    const isUserExist = await userModel.findById(userId);
    if (!isUserExist) {
      return res
        .status(404)
        .json({ success: false, message: "user not found" });
    }

    const isProductExist = await AddToCartModel.findOne({ userId, productId });
    if (isProductExist) {
      return res
        .status(409)
        .json({ success: false, message: "item already in Cart" });
    }

    const cart = await AddToCartModel.create({
      userId,
      productId,
      quantity: Number(quantity) || 1,
    });

    emitCartCount(userId);

    return res
      .status(200)
      .json({ success: true, message: "product added to cart", data: cart });
  } catch (error) {
    console.error("AddToCart error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Something went wrong" });
  }
};

const showCartsDetails = async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    return res
      .status(400)
      .json({ success: false, message: "user not authenticate !! try again" });
  }

  try {
    const data = await AddToCartModel.find({ userId });
    const cart = [];
    for (let i = 0; i < data.length; i++) {
      const productDetails = await productModel.findById(data[i].productId);
      const productImages = await imageModel.find({
        productId: data[i].productId,
      });

      if (productDetails) {
        cart.push({
          ...productDetails.toObject(),
          images: productImages,
          quantity: data[i].quantity,
        });
      }
    }

    if (data.length === 0) {
      return res.status(409).json({
        success: true,
        message: "now cart is empty !! please add item",
      });
    }

    return res.status(200).json({
      success: true,
      count: data.length,
      data: cart,
      message: "data fatched successfuly.",
    });
  } catch (error) {
    return res
      .status(400)
      .json({ success: false, message: "soe thing went wrong" });
  }
};

const deleteCartItem = async (req, res) => {
  const { productId, userId } = req.params;
  if (!productId) {
    return res
      .status(400)
      .json({ success: false, message: "product not found" });
  }
  if (!userId) {
    return res
      .status(400)
      .json({ success: false, message: "user not authenticate" });
  }

  try {
    const data = await AddToCartModel.deleteOne({ userId, productId });
    if (data.deletedCount === 0) {
      return res
        .status(404)
        .json({ success: false, message: "item not found in cart." });
    }

    emitCartCount(userId);

    return res
      .status(200)
      .json({ success: true, message: "item deleted from cart." });
  } catch (error) {
    return res
      .status(400)
      .json({ success: false, message: "some thing went wrong." });
  }
};

const showCaryItemCount = async (req, res) => {
  const { productId } = req.params;
  if (!productId) {
    return res
      .status(400)
      .json({ success: false, message: "user not authenticate" });
  }

  try {
    const cartitemCount = await AddToCartModel.findOne({ productId }).length();
    return res.status(200).json({
      success: true,
      message: "cart item found successfuly",
      count: cartitemCount,
    });
  } catch (error) {
    return res
      .status(400)
      .json({ success: false, message: "some thing went wrong." });
  }
};

// const ShowCountOfItem = async (req, res) => {
//   const { userId } = req.params;
//   if (!userId) {
//     return res
//       .status(400)
//       .json({ success: true, message: "user not authenticate ." });
//   }

//   try {
//     const count = (await AddToCartModel.find({ userId })).length();
//     return res
//       .status(200)
//       .json({
//         success: true,
//         message: "fatch item count successfully",
//         data: count,
//       });
//   } catch (error) {
//     return res
//       .status(400)
//       .json({ success: false, message: "some thing went wrong." });
//   }
// };

const ShowCountOfItem = async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).json({
      success: false,
      message: "User not authenticated",
    });
  }

  try {
    const count = await AddToCartModel.countDocuments({ userId });

    return res.status(200).json({
      success: true,
      message: "Fetched item count successfully",
      count,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

module.exports = {
  getUserHomePageDetails,
  getSingleProductDetails,
  getProductsByCategotyId,
  searchProduct,
  AddToWishList,
  ShowWishList,
  DeleteWishList,
  AddToCart,
  showCartsDetails,
  deleteCartItem,
  showCaryItemCount,
  ShowCountOfItem,
};
  