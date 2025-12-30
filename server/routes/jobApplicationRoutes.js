const express = require('express');
const router = express.Router();
const {
    submitApplication,
    submitGeneralResume,
    trackApplication,
    getMyApplications,
    getAllApplications,
    getApplicationById,
    updateApplication,
    deleteApplication,
    getApplicationStats,
} = require('../controllers/jobApplicationController');
const { protect } = require('../middleware/authMiddleware');
const resumeUpload = require('../middleware/resumeUploadMiddleware');

// Public routes
router.post('/', resumeUpload.single('resume'), submitApplication);
router.post('/general', resumeUpload.single('resume'), submitGeneralResume);
router.post('/track', trackApplication);
router.post('/my-applications', getMyApplications);

// Protected routes (Admin only)
router.get('/', protect, getAllApplications);
router.get('/stats', protect, getApplicationStats);
router.get('/:id', protect, getApplicationById);
router.put('/:id', protect, updateApplication);
router.delete('/:id', protect, deleteApplication);

module.exports = router;
