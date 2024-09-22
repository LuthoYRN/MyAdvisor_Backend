const multer = require("multer");

// Memory storage for profile pictures, documents, and videos
const imageStorage = multer.memoryStorage();
const documentStorage = multer.memoryStorage();
const videoStorage = multer.memoryStorage();

// File filters (optional)
const fileFilter = (req, file, cb) => {
  // Allow only images for profile pictures
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type, only images are allowed!"), false);
  }
};

// Middleware exports
const uploadImage = multer({ 
  storage: imageStorage,
  fileFilter: fileFilter // Add the fileFilter here
});
const uploadDocument = multer({ storage: documentStorage });
const uploadVideo = multer({ storage: videoStorage });

module.exports = { uploadImage, uploadDocument, uploadVideo };
