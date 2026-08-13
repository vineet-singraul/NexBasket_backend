const express = require("express");
const router = express.Router();

const {CreateProducts, getOwnerProducts, deleteOwnerProducts} = require("../controllers/Product/product.controller.js");


router.post("/CreateProducts", CreateProducts)
router.get("/getOwnerProducts/:id", getOwnerProducts)
router.delete("/deleteOwnerProducts/:id", deleteOwnerProducts)

module.exports = router