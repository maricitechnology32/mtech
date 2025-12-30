const express = require('express');
const router = express.Router();
const {
    submitContactForm,
    getAllContacts,
    getContactById,
    toggleContactRead,
    updateContactNotes,
    deleteContact,
    getContactStats,
} = require('../controllers/contactController');
const { protect } = require('../middleware/authMiddleware');

// Public routes
router.post('/', submitContactForm);

// Protected routes (Admin only)
router.get('/', protect, getAllContacts);
router.get('/stats', protect, getContactStats);
router.get('/:id', protect, getContactById);
router.patch('/:id/read', protect, toggleContactRead);
router.patch('/:id/notes', protect, updateContactNotes);
router.delete('/:id', protect, deleteContact);

module.exports = router;
