const {getUserHomePageDetails , getSingleProductDetails , AddToWishList,getProductsByCategotyId, searchProduct} = require("../../controllers/Users/User_Home/userHomePage.controller.js");
const express = require("express");
const { protect } = require("../../middlewares/auth.middleware.js")

const router = express.Router();

router.get("/getUserHomePageDetails",protect,getUserHomePageDetails);

router.get("/getSingleProductDetails/:productId",protect,getSingleProductDetails);

router.get("/getProductsByCategotyId/:categoryId", protect, getProductsByCategotyId)
    
router.get("/searchProduct/:searchKey", protect, searchProduct)

router.post("/AddToWishList", protect, AddToWishList)

module.exports = router