const UserModel = require("../../../models/auth_model/user.model.js");
const UserWishListModel = require("../../../models/product_model/common/addToWishlist.model.js");
const productBaseModel = require("../../../models/product_model/common/productBase.model.js");
const ProductIamgeModel = require("../../../models/product_model/common/productImage.model.js");

const getAllUserForAdmin = async (req, res) => {
  try {
    // Default value zaroor do, warna NaN aayega
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const filter = { role: "user", isVerified: true };

    const [users, totalUsers] = await Promise.all([
      UserModel.find(filter)
        .select("-password") // password hata diya
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      UserModel.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(totalUsers / limit);

    return res.status(200).json({
      success: true,
      message: "Users fetched successfully.",
      users,
      pagination: {
        totalUsers,
        totalPages,
        currentPage: page,
        limit,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
};

const getUserDetailsForAdmin = async (req, res) => {
  const { userId } = req.params;
  if (!userId) {
    return res.status(404).json({ success: false, message: "user not found" });
  }

  try {
    // 1. Sirf productId chahiye, baaki fields mat lao
    const userWishlists = await UserWishListModel.find({ userId: userId })
      .select("productId")
      .lean();

    // map only product Id ?
    const productIds = userWishlists.map((w) => w.productId);

    // 2. Products aur images ek saath, parallel mein (sirf 2 queries)
    console.time("queries");
    const [products, images] = await Promise.all([
      productBaseModel.find({ _id: { $in: productIds } }).lean(),
      ProductIamgeModel.find({ productId: { $in: productIds } })
        .select("productId imageUrl -_id")
        .lean(),
    ]);

    // 3. Images ko productId ke hisaab se group karo (memory mein, fast)
    const imagesByProduct = {};
    for (const img of images) {
      const key = img.productId.toString();
      (imagesByProduct[key] ||= []).push(img.imageUrl);
    }

    const result = products.map((p) => ({
      ...p,
      images: imagesByProduct[p._id.toString()] || [],
    }));

    return res.status(200).json({ success: true, data: result });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Something went wrong" });
  }
};

module.exports = { getAllUserForAdmin, getUserDetailsForAdmin };
