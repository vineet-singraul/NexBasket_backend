const mongoose = require("mongoose");

const AdressSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    lattitude: String,
    logitude: String,
    AdressIs: {
      type: String,
      enum: ["House", "Ofice", "othrt"],
      required: true,
    },
    fullAdress : {
        type:String,
        required:true
    },
    AdressConfirm : {
        type:String,
        required:true
    },
    LandMark : {
        type:String
    }
  },
  { timestamps: true },
);

module.exports = AdressSchema