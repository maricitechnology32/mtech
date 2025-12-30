const express = require('express');
const router = express.Router();
const {
    getTestimonials,
    getTestimonialById,
    createTestimonial,
    updateTestimonial,
    deleteTestimonial,
    getTestimonialStats,
} = require('../controllers/testimonialController');
const upload = require('../middleware/uploadMiddleware');
const { protect } = require('../middleware/authMiddleware');

// Public routes
router.get('/', getTestimonials);
router.get('/stats', protect, getTestimonialStats);
router.get('/:id', getTestimonialById);

// Protected routes (Admin only)
router.post('/', protect, upload.single('image'), createTestimonial);
router.put('/:id', protect, upload.single('image'), updateTestimonial);
router.delete('/:id', protect, deleteTestimonial);

module.exports = router;
