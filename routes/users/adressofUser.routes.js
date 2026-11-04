const express = require("express");
const {SaveUserAdress} = require("../../controllers/Users/Adresses/adresses.controller.js");

const router = express.Router();

router.post("/SaveUserAdress", SaveUserAdress)


module.exports = router