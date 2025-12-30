const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Team member name is required'],
        trim: true,
    },
    position: {
        type: String,
        required: [true, 'Position is required'],
        trim: true,
    },
    bio: {
        type: String,
        default: '',
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
    },
    phone: {
        type: String,
        trim: true,
    },
    photo: {
        url: String,
        publicId: String,
    },
    socialLinks: {
        linkedin: { type: String, default: '' },
        github: { type: String, default: '' },
        twitter: { type: String, default: '' },
        website: { type: String, default: '' },
    },
    department: {
        type: String,
        enum: ['Leadership', 'Development', 'Design', 'Marketing', 'Sales', 'Support', 'Other'],
        default: 'Development',
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

module.exports = mongoose.model('Team', teamSchema);
