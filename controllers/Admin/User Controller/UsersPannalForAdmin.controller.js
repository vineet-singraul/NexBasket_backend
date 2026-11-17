const UserModel = require("../../../models/auth_model/user.model.js");

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

module.exports = { getAllUserForAdmin };
