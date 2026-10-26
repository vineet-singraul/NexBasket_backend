const {
  getUserHomePageDetails,
  getSingleProductDetails,
  AddToWishList,
  getProductsByCategotyId,
  searchProduct,
  ShowWishList,
  AddToCart,
  showCartsDetails,
  deleteCartItem,
  showCaryItemCount,
  ShowCountOfItem
} = require("../../controllers/Users/User_Home/userHomePage.controller.js");
const express = require("express");
const { protect } = require("../../middlewares/auth.middleware.js");

const router = express.Router();

router.get("/getUserHomePageDetails", protect, getUserHomePageDetails);

router.get(
  "/getSingleProductDetails/:productId",
  protect,
  getSingleProductDetails,
);

router.get(
  "/getProductsByCategotyId/:categoryId",
  protect,
  getProductsByCategotyId,
);

router.get("/searchProduct/:searchKey", protect, searchProduct);

router.post("/AddToWishList", protect, AddToWishList);

router.get("/ShowWishList/:userId", protect, ShowWishList);

router.get("/showCartsDetails/:userId", protect, showCartsDetails);

router.post("/AddToCart", protect, AddToCart);

router.delete("/deleteCartItem/:productId/:userId", protect, deleteCartItem);

router.get("/ShowCountOfItem/:userId", protect, ShowCountOfItem);

module.exports = router;
