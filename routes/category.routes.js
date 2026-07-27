const express = require("express");

const {addCategory,getSingleOwnerCategory} = require("../controllers/category.controller.js");
const {isOwner} = require("../middlewares/IsOwnerAuth.js")
const {protect} = require("../middlewares/auth.middleware.js");
const router = express.Router();

router.post("/addCategory",protect,isOwner,addCategory);
router.get("/getSingleOwnerCategory/:id",protect,isOwner,getSingleOwnerCategory)


module.exports = router;