const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Project title is required'],
        trim: true,
    },
    description: {
        type: String,
        required: [true, 'Project description is required'],
    },
    shortDescription: {
        type: String,
        maxlength: 200,
    },
    client: {
        type: String,
        default: '',
    },
    category: {
        type: String,
        enum: ['Web Development', 'Mobile App', 'AI/ML', 'UI/UX Design', 'E-Commerce', 'Other'],
        default: 'Web Development',
    },
    technologies: [{
        type: String,
        trim: true,
    }],
    images: [{
        url: String,
        publicId: String,
    }],
    featuredImage: {
        url: String,
        publicId: String,
    },
    liveUrl: {
        type: String,
        default: '',
    },
    githubUrl: {
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
    startDate: {
        type: Date,
    },
    endDate: {
        type: Date,
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

module.exports = mongoose.model('Project', projectSchema);
