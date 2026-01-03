const express = require('express');
const router = express.Router();
const {
    getServices,
    getServiceById,
    createService,
    updateService,
    deleteService,
    getServiceStats,
} = require('../controllers/serviceController');
const upload = require('../middleware/uploadMiddleware')('Marici Technology-services');
const { protect } = require('../middleware/authMiddleware');

// Public routes
router.get('/', getServices);
router.get('/stats', protect, getServiceStats);
router.get('/:id', getServiceById);

// Protected routes (Admin only)
router.post('/', protect, upload.single('image'), createService);
router.put('/:id', protect, upload.single('image'), updateService);
router.delete('/:id', protect, deleteService);

module.exports = router;
