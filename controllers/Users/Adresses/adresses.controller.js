const AdressesModel = require("../../../models/product_model/common/adresses.model.js");
const mongoose = require("mongoose");
const { checkUserAdressesIsValid } = require("../../../utils/validations.js");

const SaveUserAdress = async (req, res) => {
  const {
    userId,
    lattitude,
    logitude,
    AdressIs,
    fullAdress,
    AdressConfirm,
    LandMark,
  } = req.body;

  const validAdress = checkUserAdressesIsValid(
    lattitude,
    logitude,
    AdressIs,
    fullAdress,
    AdressConfirm,
    LandMark,
  );

  try {
    const response = await AdressesModel.create({
      userId,
      lattitude,
      logitude,
      AdressIs,
      fullAdress,
      AdressConfirm,
      LandMark,
    });
    console.log("<------------------>",response)
    return res.status(200).json({success:true,message:"adress validation successfully",data:response,valid:validAdress})
  } catch (error) {
    return res.status(400).json({success:false,message:"some thing wrong"})
  }
};

module.exports = { SaveUserAdress };
