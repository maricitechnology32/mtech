const express = require('express');
const router = express.Router();
const {
    loginAdmin,
    getAdminProfile,
    registerAdmin,
    updatePassword,
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

// Public routes
router.post('/login', loginAdmin);
router.post('/register', registerAdmin);

// Protected routes
router.get('/profile', protect, getAdminProfile);
router.put('/password', protect, updatePassword);

module.exports = router;
