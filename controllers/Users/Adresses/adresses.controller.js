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

  try {
    // AI fail ho jaye to bhi address save hona chahiye, user ka original data use hoga
    let validAdress = null;
    try {
      validAdress = await checkUserAdressesIsValid(
        lattitude,
        logitude,
        AdressIs,
        fullAdress,
        AdressConfirm,
        LandMark,
      );
    } catch (aiError) {
      console.log("Address AI validation skipped:", aiError.message);
    }

    const response = await AdressesModel.create({
      userId,
      lattitude,
      logitude,
      AdressIs,
      // AI ka corrected address save karo, khaali ho to user ka original rakho
      fullAdress: validAdress?.fullAdress || fullAdress,
      AdressConfirm: validAdress?.AdressConfirm || AdressConfirm,
      LandMark: validAdress?.LandMark || LandMark,
    });

    return res.status(200).json({success:true,message:"adress validation successfully",data:response,valid:validAdress})
  } catch (error) {
    console.log("SaveUserAdress error:", error.message);
    return res.status(400).json({success:false,message:"some thing wrong",error:error.message})
  }
};

module.exports = { SaveUserAdress };
