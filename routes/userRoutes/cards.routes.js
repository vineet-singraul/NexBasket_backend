const express = require("express");
const {getAllCards} = require("../../controllers/User/Cards.controller.js");


const router = express.Router();

router.get("/getAllCards/:storeId", getAllCards);

module.exports = router;