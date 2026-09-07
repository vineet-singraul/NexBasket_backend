const multer = require("multer");
const path = require("path");

const storage = multer.memoryStorage();

const allowedExtensions = [".png", ".jpg", ".jpeg", ".gif", ".webp", ".bmp", ".svg"];

const fileFilter = (req, file, cb) => {
  const isImageMime = file.mimetype.startsWith("image/");
  const isImageExtension = allowedExtensions.includes(
    path.extname(file.originalname).toLowerCase(),
  );

  // Some clients (e.g. Postman) send "application/octet-stream" instead of
  // the real image mimetype, so fall back to checking the file extension.
  if (isImageMime || isImageExtension) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

module.exports = upload;
