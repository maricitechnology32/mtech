const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'Marici Technology-testimonials', // Folder name in Cloudinary
        allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
    },
});

const upload = multer({ storage: storage });

module.exports = upload;
