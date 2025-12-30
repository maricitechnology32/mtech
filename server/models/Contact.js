const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    company: {
        type: String,
    },
    service: {
        type: String,
        enum: ['Website Development', 'Mobile Application Development', 'Artificial Intelligence Solutions', 'Multiple Services', 'Other', 'UI/UX Design', 'Consulting'],
        default: 'Other',
    },
    message: {
        type: String,
        required: true,
    },
    isRead: {
        type: Boolean,
        default: false,
    },
    notes: {
        type: String,
        default: '',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Contact', contactSchema);
