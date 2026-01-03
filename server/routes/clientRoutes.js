const express = require('express');
const router = express.Router();
const {
    getClients,
    getClientById,
    createClient,
    updateClient,
    deleteClient,
    getClientStats,
} = require('../controllers/clientController');
const upload = require('../middleware/uploadMiddleware')('Marici Technology-clients');
const { protect } = require('../middleware/authMiddleware');

// Public routes
router.get('/', getClients);
router.get('/stats', protect, getClientStats);
router.get('/:id', getClientById);

// Protected routes (Admin only)
router.post('/', protect, upload.single('logo'), createClient);
router.put('/:id', protect, upload.single('logo'), updateClient);
router.delete('/:id', protect, deleteClient);

module.exports = router;
