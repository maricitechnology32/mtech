const mongoose = require('mongoose');

const testimonialSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    position: {
        type: String,
        required: true,
    },
    company: {
        type: String,
        required: true,
    },
    testimonial: {
        type: String,
        required: true,
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
        default: 5,
    },
    image: {
        type: String, // URL from Cloudinary
    },
    imagePublicId: {
        type: String, // Public ID for deletion if needed
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Testimonial', testimonialSchema);
