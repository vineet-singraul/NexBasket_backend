const express = require("express");
const {ShowAllCategoryToUser, getSingleCategoryByItsOwnId} = require("../../controllers/Users/User_Category/UserShowCategory.js")
const router = express.Router();
const {protect} = require("../../middlewares/auth.middleware.js")


router.get("/ShowAllCategoryToUser",protect, ShowAllCategoryToUser);
router.get("/getSingleCategoryByItsOwnId/:categoryId",protect, getSingleCategoryByItsOwnId);

module.exports = router