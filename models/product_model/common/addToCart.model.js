const mongoose = require("mongoose");

const AddToCartShema = new mongoose.Schema({
 productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ProductBase",
    required: true
 },

 userId : {
    type:mongoose.Schema.Types.ObjectId,
    ref: "User",
    required:true
 },
 quantity : {
    type: Number
 }
},{timestamps:true})

AddToCartShema.index({ userId: 1, productId: 1 }, { unique: true});

const AddToCart = mongoose.model("AddToCart", AddToCartShema);

module.exports = AddToCart