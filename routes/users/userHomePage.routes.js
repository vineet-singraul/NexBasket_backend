const {getUserHomePageDetails , getSingleProductDetails , getProductsByCategotyId} = require("../../controllers/Users/User_Home/userHomePage.controller.js");
const express = require("express");
const { protect } = require("../../middlewares/auth.middleware.js")

const router = express.Router();

router.get("/getUserHomePageDetails",protect,getUserHomePageDetails);

router.get("/getSingleProductDetails/:productId",protect,getSingleProductDetails);

router.get("/getProductsByCategotyId/:categoryId", protect, getProductsByCategotyId)


module.exports = router