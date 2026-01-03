const express = require('express');
const router = express.Router();
const {
    getProjects,
    getProjectById,
    createProject,
    updateProject,
    deleteProject,
    getProjectStats,
} = require('../controllers/projectController');
const upload = require('../middleware/uploadMiddleware')('Marici Technology-projects');
const { protect } = require('../middleware/authMiddleware');

// Public routes
router.get('/', getProjects);
router.get('/stats', protect, getProjectStats);
router.get('/:id', getProjectById);

// Protected routes (Admin only)
router.post('/', protect, upload.single('image'), createProject);
router.put('/:id', protect, upload.single('image'), updateProject);
router.delete('/:id', protect, deleteProject);

module.exports = router;
