const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Service title is required'],
        trim: true,
    },
    description: {
        type: String,
        required: [true, 'Service description is required'],
    },
    shortDescription: {
        type: String,
        maxlength: 150,
    },
    icon: {
        type: String,
        default: 'Code2', // lucide-react icon name
    },
    features: [{
        type: String,
        trim: true,
    }],
    gradient: {
        type: String,
        default: 'from-blue-500 to-blue-700',
    },
    image: {
        url: String,
        publicId: String,
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

module.exports = mongoose.model('Service', serviceSchema);
