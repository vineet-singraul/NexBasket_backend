const cloudinary = require("../config/cloudinary.js");

// Uploads an in-memory file buffer (from multer memoryStorage) to Cloudinary
// and resolves with the resulting object (use .secure_url for the string URL).
const uploadBufferToCloudinary = (fileBuffer, folder = "stores") => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder, resource_type: "image" },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      },
    );

    uploadStream.end(fileBuffer);
  });
};

module.exports = { uploadBufferToCloudinary };
