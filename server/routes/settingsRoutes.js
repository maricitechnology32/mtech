const express = require('express');
const router = express.Router();
const { getSettings, updateSettings } = require('../controllers/settingsController');
const { protect } = require('../middleware/authMiddleware');

// Public route - get settings
router.get('/', getSettings);

// Protected route - update settings
router.put('/', protect, updateSettings);

module.exports = router;
