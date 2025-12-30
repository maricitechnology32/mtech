const Contact = require('../models/Contact');

// @desc    Submit a contact form
// @route   POST /api/contact
// @access  Public
const submitContactForm = async (req, res) => {
    try {
        const { name, email, company, service, message } = req.body;

        if (!name || !email || !message) {
            res.status(400);
            throw new Error('Please fill in all required fields.');
        }

        const newContact = await Contact.create({
            name,
            email,
            company,
            service,
            message,
        });

        res.status(201).json(newContact);
    } catch (error) {
        res.status(500);
        throw new Error(error.message);
    }
};

// @desc    Get all contacts
// @route   GET /api/contact
// @access  Private (Admin)
const getAllContacts = async (req, res) => {
    try {
        const contacts = await Contact.find().sort({ createdAt: -1 });
        res.json(contacts);
    } catch (error) {
        res.status(500);
        throw new Error('Server error retrieving contacts.');
    }
};

// @desc    Get single contact
// @route   GET /api/contact/:id
// @access  Private (Admin)
const getContactById = async (req, res) => {
    try {
        const contact = await Contact.findById(req.params.id);

        if (!contact) {
            res.status(404);
            throw new Error('Contact not found');
        }

        res.json(contact);
    } catch (error) {
        res.status(res.statusCode === 200 ? 500 : res.statusCode);
        throw new Error(error.message);
    }
};

// @desc    Mark contact as read/unread
// @route   PATCH /api/contact/:id/read
// @access  Private (Admin)
const toggleContactRead = async (req, res) => {
    try {
        const contact = await Contact.findById(req.params.id);

        if (!contact) {
            res.status(404);
            throw new Error('Contact not found');
        }

        contact.isRead = !contact.isRead;
        await contact.save();

        res.json(contact);
    } catch (error) {
        res.status(res.statusCode === 200 ? 500 : res.statusCode);
        throw new Error(error.message);
    }
};

// @desc    Update contact notes
// @route   PATCH /api/contact/:id/notes
// @access  Private (Admin)
const updateContactNotes = async (req, res) => {
    try {
        const { notes } = req.body;
        const contact = await Contact.findById(req.params.id);

        if (!contact) {
            res.status(404);
            throw new Error('Contact not found');
        }

        contact.notes = notes || '';
        await contact.save();

        res.json(contact);
    } catch (error) {
        res.status(res.statusCode === 200 ? 500 : res.statusCode);
        throw new Error(error.message);
    }
};

// @desc    Delete contact
// @route   DELETE /api/contact/:id
// @access  Private (Admin)
const deleteContact = async (req, res) => {
    try {
        const contact = await Contact.findById(req.params.id);

        if (!contact) {
            res.status(404);
            throw new Error('Contact not found');
        }

        await Contact.findByIdAndDelete(req.params.id);

        res.json({ message: 'Contact deleted successfully', id: req.params.id });
    } catch (error) {
        res.status(res.statusCode === 200 ? 500 : res.statusCode);
        throw new Error(error.message);
    }
};

// @desc    Get contact stats
// @route   GET /api/contact/stats
// @access  Private (Admin)
const getContactStats = async (req, res) => {
    try {
        const total = await Contact.countDocuments();
        const unread = await Contact.countDocuments({ isRead: false });
        const read = await Contact.countDocuments({ isRead: true });

        res.json({
            total,
            unread,
            read,
        });
    } catch (error) {
        res.status(500);
        throw new Error('Server error retrieving stats.');
    }
};

module.exports = {
    submitContactForm,
    getAllContacts,
    getContactById,
    toggleContactRead,
    updateContactNotes,
    deleteContact,
    getContactStats,
};
