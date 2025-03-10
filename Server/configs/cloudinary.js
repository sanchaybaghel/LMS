const cloudinary = require('cloudinary').v2;

const connectCloudinary = async () => {
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_SECRET_KEY, // Corrected key
    });
};

module.exports = connectCloudinary;