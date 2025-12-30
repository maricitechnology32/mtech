const multer = require('multer');

// Use memory storage for resume files
// Files will be uploaded to Cloudinary manually in the controller
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
    // Allow common resume file types
    const allowedMimeTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];

    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only PDF, DOC, and DOCX files are allowed.'), false);
    }
};

const resumeUpload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
    },
});

module.exports = resumeUpload;
