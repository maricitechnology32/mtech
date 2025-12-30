const express = require('express');
const router = express.Router();
const {
    getBlogs,
    getBlogBySlug,
    createBlog,
    updateBlog,
    uploadContentImage,
    deleteBlog,
    getBlogStats,
} = require('../controllers/blogController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Public routes
router.get('/', getBlogs);
router.get('/stats', protect, getBlogStats);
router.get('/:identifier', getBlogBySlug);

// Protected routes (Admin only)
router.post('/', protect, upload.fields([{ name: 'featuredImage', maxCount: 1 }]), createBlog);
router.put('/:id', protect, upload.fields([{ name: 'featuredImage', maxCount: 1 }]), updateBlog);
router.post('/upload-image', protect, upload.single('image'), uploadContentImage);
router.delete('/:id', protect, deleteBlog);

module.exports = router;
