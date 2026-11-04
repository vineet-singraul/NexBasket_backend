const express = require("express");
const {
  SaveUserAdress,
  gatAddressOfUser,
  deleteAddress,
} = require("../../controllers/Users/Adresses/adresses.controller.js");

const router = express.Router();

router.post("/SaveUserAdress", SaveUserAdress);

router.get("/gatAddressOfUser/:userId", gatAddressOfUser);

router.delete("/deleteAddress/:userId/:_id", deleteAddress);


module.exports = router