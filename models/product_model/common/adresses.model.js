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
      enum: ["Home", "Work", "Other"],
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

const Adresses = mongoose.model("Adresses", AdressSchema);

module.exports = Adresses;