const mongoose = require("mongoose");

const AddToWishListSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProductBase",
      required: true,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    quantity: {
      type: Number,
    }
  },
  {
    timestamps: true,
  },
);

// Prevent duplicate wishlist entries for the same user and product
AddToWishListSchema.index({ userId: 1, productId: 1 }, { unique: true });

const AddToWishList = mongoose.model("AddToWishList", AddToWishListSchema);

module.exports = AddToWishList;
