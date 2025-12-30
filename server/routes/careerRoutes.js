const express = require('express');
const router = express.Router();
const {
    getCareers,
    getCareerById,
    createCareer,
    updateCareer,
    deleteCareer,
    getCareerStats,
} = require('../controllers/careerController');
const { protect } = require('../middleware/authMiddleware');

// Public routes
router.get('/', getCareers);
router.get('/stats', protect, getCareerStats);
router.get('/:id', getCareerById);

// Protected routes (Admin only)
router.post('/', protect, createCareer);
router.put('/:id', protect, updateCareer);
router.delete('/:id', protect, deleteCareer);

module.exports = router;
