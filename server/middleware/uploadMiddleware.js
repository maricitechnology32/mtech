const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

const createUploadMiddleware = (folderName) => {
    const storage = new CloudinaryStorage({
        cloudinary: cloudinary,
        params: {
            folder: folderName, // Use the passed folder name
            allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
        },
    });

    return multer({ storage: storage });
};

module.exports = createUploadMiddleware;
