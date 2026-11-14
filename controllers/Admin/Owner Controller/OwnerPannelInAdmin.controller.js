const OwnerModel = require("../../../models/auth_model/user.model.js");
const OwnerProductModel = require("../../../models/product_model/common/productBase.model.js");
const OwnerProductImageModel = require("../../../models/product_model/common/productImage.model.js");
const OwnerOfStoreModel = require("../../../models/store_model/store.model.js");

const OwnerDetails = async (req, res) => {
  try {
    const bindOwnerWithDetails = [];
    const productWithImages = [];
    const ownerdata = await OwnerModel.find({
      role: "owner",
      isVerified: true,
    }).distinct("_id");

    for (const owner of ownerdata) {
      // Find first store belonging to this owner
      const owners = await OwnerOfStoreModel.findOne({
        owner: owner,
      });

      // if store is not of owner ! skip the owner
      if (!owners) continue;

      // find the all product by the store id .
      const product = await OwnerProductModel.find({
        storeId: owners._id,
      });

      // Find the images of the al product .
      for (const item of product) {
        const images = await OwnerProductImageModel.find({
          productId: item._id,
        });

        productWithImages.push({
          ...item.toObject(),
          images: images,
        });
      }

      // Bind all details
      bindOwnerWithDetails.push({
        ownerId: owner,
        ownerDetails: owners,
        productWithImages,
      });
    }

    return res.status(200).json({
      success: true,
      message: "find owner details successfully",
      count: bindOwnerWithDetails.length,
      data: bindOwnerWithDetails,
    });
  } catch (error) {
    3;
    return res.status(400).json({
      success: false,
      message: error.message | "some thing went wrong .. ",
    });
  }
};


const OwnerDeleteWithProductsAndStore = async (req, res) => {
  try {
    const { ownerId } = req.params;

    if (!ownerId) {
      return res.status(400).json({
        success: false,
        message: "Owner ID is required",
      });
    }

    // 1. Check owner exists
    const isOwnerExits = await OwnerModel.findById(ownerId);

    if (!isOwnerExits) {
      return res.status(404).json({
        success: false,
        message: "Owner not found",
      });
    }

    // 2. Find owner's stores
    const stores = await OwnerOfStoreModel.find({
      owner: ownerId,
    }).select("_id");

    // 3. Find products linked to those stores
    const storeIds = stores.map((store) => store._id);

    const products = storeIds.length > 0
      ? await OwnerProductModel.find({
          storeId: { $in: storeIds },
        }).select("_id")
      : [];

    // 4. Prevent deletion if store or product exists
    if (stores.length > 0 || products.length > 0) {
      return res.status(409).json({
        success: false,
        message:
          "Owner cannot be deleted because stores or products exist.",
        storeCount: stores.length,
        productCount: products.length,
      });
    }

    // 5. Delete owner
    const deleteTheOwner = await OwnerModel.deleteOne({
      _id: ownerId,
    });

    if (deleteTheOwner.deletedCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Owner deletion failed or owner not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Owner deleted successfully.",
    });

  } catch (error) {
    console.error("Owner Delete Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

module.exports = { OwnerDetails, OwnerDeleteWithProductsAndStore };
