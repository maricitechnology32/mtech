const express = require('express');
const router = express.Router();
const {
    getTeamMembers,
    getTeamMemberById,
    createTeamMember,
    updateTeamMember,
    deleteTeamMember,
    getTeamStats,
} = require('../controllers/teamController');
const upload = require('../middleware/uploadMiddleware')('Marici Technology-team');
const { protect } = require('../middleware/authMiddleware');

// Public routes
router.get('/', getTeamMembers);
router.get('/stats', protect, getTeamStats);
router.get('/:id', getTeamMemberById);

// Protected routes (Admin only)
router.post('/', protect, upload.single('photo'), createTeamMember);
router.put('/:id', protect, upload.single('photo'), updateTeamMember);
router.delete('/:id', protect, deleteTeamMember);

module.exports = router;
