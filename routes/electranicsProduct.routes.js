const express = require("express");

const {creatElectranicBaseProduct} = require("../controllers/Products/electranics/electranics.controller.js");

const router = express.Router();

router.post("/creatElectranicBaseProduct", creatElectranicBaseProduct);


module.exports = router