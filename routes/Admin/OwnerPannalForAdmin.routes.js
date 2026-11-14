const {OwnerDetails, OwnerDeleteWithProductsAndStore} = require("../../controllers/Admin/Owner Controller/OwnerPannelInAdmin.controller.js");
const express = require("express");

const router = express.Router();

router.get("/OwnerDetails", OwnerDetails);

router.get("/OwnerDeleteWithProductsAndStore/:ownerId", OwnerDeleteWithProductsAndStore)

module.exports = router;