const multer = require("multer");
const path = require("path");

// Storage for profile pictures
const imageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./db/uploads/profile-pictures/");
  },
  filename: (req, file, cb) => {
    cb(null, `image_${Date.now()}${path.extname(file.originalname)}`);
  },
});

// Storage for documents
const documentStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./db/uploads/documents/");
  },
  filename: (req, file, cb) => {
    cb(null, `doc_${Date.now()}${path.extname(file.originalname)}`);
  },
});

// Storage for video recordings
const videoStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./db/uploads/videos/");
  },
  filename: (req, file, cb) => {
    cb(null, `video_${Date.now()}${path.extname(file.originalname)}`);
  },
});

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
  fileFilter,
  limits: { fileSize: 1024 * 1024 * 2 },
});
const uploadDocument = multer({ storage: documentStorage });
const uploadVideo = multer({ storage: videoStorage });

module.exports = { uploadImage, uploadDocument, uploadVideo };
