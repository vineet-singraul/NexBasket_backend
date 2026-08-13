const storeModel = require("../../models/store_model/store.model.js");
const { uploadBufferToCloudinary } = require("../../utils/cloudinary.util.js");
const { sentOtpEmailInCreateStoreTime } = require("../../utils/mailer.util.js");
const { generatePassword } = require("../../utils/authOtp.util.js");


const AddStore = async (req, res) => {
  try {
    const owner = req.user._id;

    const { storeName, description, email, phone, gstNumber } = req.body;

    const address = req.body.address ? JSON.parse(req.body.address) : {};

    const logoFile = req.files?.logo ? req.files.logo[0] : null;

    const bannerFile = req.files?.banner ? req.files.banner[0] : null;

    if (!storeName || !description || !email) {
      return res.status(400).json({
        success: false,
        message: "Store name, description and email are required.",
      });
    }

    const existingStore = await storeModel.findOne({ email });

    if (existingStore) {
      return res.status(409).json({
        success: false,
        message: "Store with this email already exists.",
      });
    }

    const [logoResult, bannerResult] = await Promise.all([
      logoFile
        ? uploadBufferToCloudinary(logoFile.buffer, "stores/logos")
        : null,
      bannerFile
        ? uploadBufferToCloudinary(bannerFile.buffer, "stores/banners")
        : null,
    ]);

    const logo = logoResult?.secure_url;
    const banner = bannerResult?.secure_url;
    const password = generatePassword()
    const newStore = await storeModel.create({
      owner,
      storeName,
      description,
      email,
      phone,
      gstNumber,
      address,
      logo,
      banner,
      password
    });
    await sentOtpEmailInCreateStoreTime({
      toEmail: email,
      password,
      storeLogo: logo,
      storeBanner: banner,
    });
    return res.status(201).json({
      success: true,
      message: "Store created successfully.",
      data: newStore,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

const showOnlyOwnerStore = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({
      success: false,
      message: "Owner ID is required.",
    });
  }

  try {
    const store = await storeModel.find({ owner: id });

    if (!store.length) {
      return res.status(404).json({
        success: false,
        message: "No store found for this owner.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Store fetched successfully.",
      data: store,
    });
  } catch (error) {
    console.error("Show Store Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error.",
      error: error.message,
    });
  }
};

const deleteOwnerStore = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({
      success: false,
      message: "Store ID is required.",
    });
  }

  try {
    const response = await storeModel.findById(id);

    if (!response) {
      return res.status(404).json({
        success: false,
        message: "Store not found.",
      });
    }

    await storeModel.findByIdAndDelete(id);
    
    return res.status(200).json({
      success: true,
      message: "Store deleted successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error.",
    });
  }
};

const EditOwnerDetails = async (req, res) => {
  try {
    const owner = req.user._id;

    const { storeName, description, email, phone, gstNumber } = req.body;

    const address = req.body.address ? JSON.parse(req.body.address) : {};

    const logoFile = req.files?.logo ? req.files.logo[0] : null;
    const bannerFile = req.files?.banner ? req.files.banner[0] : null;

    if (!storeName || !description || !email) {
      return res.status(400).json({
        success: false,
        message: "Store name, description and email are required.",
      });
    }

    // Owner ka apna store dhoondo
    const store = await storeModel.findOne({ owner });

    if (!store) {
      return res.status(404).json({
        success: false,
        message: "Store not found for this owner.",
      });
    }

    // Agar email change ho raha hai, toh check karo ki koi ANOTHER store already usko use toh nahi kar raha
    if (email !== store.email) {
      const existingStore = await storeModel.findOne({
        email,
        _id: { $ne: store._id }, // apne aap ko exclude karo
      });

      if (existingStore) {
        return res.status(409).json({
          success: false,
          message: "Another store with this email already exists.",
        });
      }
    }

    // Naya logo/banner sirf tab upload karo jab file aayi ho
    const [logoResult, bannerResult] = await Promise.all([
      logoFile
        ? uploadBufferToCloudinary(logoFile.buffer, "stores/logos")
        : null,
      bannerFile
        ? uploadBufferToCloudinary(bannerFile.buffer, "stores/banners")
        : null,
    ]);

    // Update object banao — sirf jo values di gayi hain unhi ko update karo
    store.storeName = storeName;
    store.description = description;
    store.email = email;
    store.phone = phone || store.phone;
    store.gstNumber = gstNumber || store.gstNumber;
    store.address = address && Object.keys(address).length ? address : store.address;

    // Logo/banner sirf tab overwrite karo jab nayi file aayi ho, warna purana rehne do
    if (logoResult?.secure_url) {
      store.logo = logoResult.secure_url;
    }
    if (bannerResult?.secure_url) {
      store.banner = bannerResult.secure_url;
    }

    const updatedStore = await store.save();

    return res.status(200).json({
      success: true,
      message: "Store updated successfully.",
      data: updatedStore,
    });
  } catch (error) {
    console.log("Edit store error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while updating store.",
    });
  }
};

const getSingleOwner = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({
      success: false,
      message: "Store ID is required.",
    });
  }

  try {
    const store = await storeModel.findById(id);

    if (!store) {
      return res.status(404).json({
        success: false,
        message: "Store not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Store fetched successfully.",
      data: store,
    });
  } catch (error) {
    console.error("Get Single Store Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error.",
      error: error.message,
    });
  }
};

module.exports = {
  AddStore,
  showOnlyOwnerStore,
  deleteOwnerStore,
  EditOwnerDetails,
  getSingleOwner
};
