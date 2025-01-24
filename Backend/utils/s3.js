require("dotenv").config({ path: `${process.cwd()}/.env` });
const {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} = require("@aws-sdk/client-s3");
const path = require("path");

const BUCKET_NAME = process.env.BUCKET_NAME;
const BUCKET_REGION = process.env.BUCKET_REGION;
const ACCESS_KEY = process.env.ACCESS_KEY;
const SECRET_KEY = process.env.SECRET_KEY;
const PUBLIC_URL = process.env.PUBLIC_URL;

// Configure S3 client
const s3Client = new S3Client({
  endpoint: EMD_POINT,
  region: BUCKET_REGION,
  credentials: {
    accessKeyId: ACCESS_KEY,
    secretAccessKey: SECRET_KEY,
  },
});

// Function to upload file to S3
const uploadToS3 = async (fileBuffer, fileName, mimetype) => {
  const params = {
    Bucket: BUCKET_NAME,
    Key: fileName, // Create folder structure dynamically
    Body: fileBuffer,
    ContentType: mimetype,
  };

  try {
    // Using the send method to execute the PutObjectCommand
    const data = await s3Client.send(new PutObjectCommand(params));
    // Return the public S3 URL of the uploaded file
    return `${PUBLIC_URL}/${fileName}`;
  } catch (error) {
    console.error("Error uploading to S3:", error);
    throw new Error("S3 upload failed");
  }
};

// Function to delete file from S3
const deleteFromS3 = async (fileName) => {
  const params = {
    Bucket: BUCKET_NAME,
    Key: fileName, // The key should be the full path in S3
  };

  try {
    // Using the send method to execute the DeleteObjectCommand
    await s3Client.send(new DeleteObjectCommand(params));
    console.log("File deleted successfully from S3");
  } catch (error) {
    console.error("Error deleting file from S3:", error);
  }
};

module.exports = { uploadToS3, deleteFromS3 };
