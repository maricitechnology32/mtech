const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Client/Company name is required'],
        trim: true,
    },
    industry: {
        type: String,
        default: 'Technology',
    },
    logo: {
        url: String,
        publicId: String,
    },
    website: {
        type: String,
        default: '',
    },
    description: {
        type: String,
        default: '',
    },
    isFeatured: {
        type: Boolean,
        default: false,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    order: {
        type: Number,
        default: 0,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Client', clientSchema);
