const Testimonial = require('../models/Testimonial');
const cloudinary = require('../config/cloudinary');

// @desc    Get all testimonials
// @route   GET /api/testimonials
// @access  Public
const getTestimonials = async (req, res) => {
    try {
        const testimonials = await Testimonial.find().sort({ createdAt: -1 });
        res.json(testimonials);
    } catch (error) {
        res.status(500);
        throw new Error('Server error retrieving testimonials.');
    }
};

// @desc    Get single testimonial
// @route   GET /api/testimonials/:id
// @access  Public
const getTestimonialById = async (req, res) => {
    try {
        const testimonial = await Testimonial.findById(req.params.id);

        if (!testimonial) {
            res.status(404);
            throw new Error('Testimonial not found');
        }

        res.json(testimonial);
    } catch (error) {
        res.status(res.statusCode === 200 ? 500 : res.statusCode);
        throw new Error(error.message);
    }
};

// @desc    Add a new testimonial
// @route   POST /api/testimonials
// @access  Private (Admin)
const createTestimonial = async (req, res) => {
    try {
        const { name, position, company, testimonial, rating } = req.body;

        if (!name || !testimonial) {
            res.status(400);
            throw new Error('Name and testimonial are required');
        }

        let image = '';
        let imagePublicId = '';

        if (req.file) {
            image = req.file.path;
            imagePublicId = req.file.filename;
        }

        const newTestimonial = await Testimonial.create({
            name,
            position,
            company,
            testimonial,
            rating: rating || 5,
            image,
            imagePublicId,
        });

        res.status(201).json(newTestimonial);
    } catch (error) {
        res.status(500);
        throw new Error(error.message);
    }
};

// @desc    Update testimonial
// @route   PUT /api/testimonials/:id
// @access  Private (Admin)
const updateTestimonial = async (req, res) => {
    try {
        const { name, position, company, testimonial, rating } = req.body;

        const existingTestimonial = await Testimonial.findById(req.params.id);

        if (!existingTestimonial) {
            res.status(404);
            throw new Error('Testimonial not found');
        }

        // Update fields
        existingTestimonial.name = name || existingTestimonial.name;
        existingTestimonial.position = position || existingTestimonial.position;
        existingTestimonial.company = company || existingTestimonial.company;
        existingTestimonial.testimonial = testimonial || existingTestimonial.testimonial;
        existingTestimonial.rating = rating || existingTestimonial.rating;

        // Handle image update
        if (req.file) {
            // Delete old image from Cloudinary if exists
            if (existingTestimonial.imagePublicId) {
                try {
                    await cloudinary.uploader.destroy(existingTestimonial.imagePublicId);
                } catch (cloudError) {
                    console.error('Error deleting old image:', cloudError);
                }
            }

            existingTestimonial.image = req.file.path;
            existingTestimonial.imagePublicId = req.file.filename;
        }

        const updatedTestimonial = await existingTestimonial.save();

        res.json(updatedTestimonial);
    } catch (error) {
        res.status(res.statusCode === 200 ? 500 : res.statusCode);
        throw new Error(error.message);
    }
};

// @desc    Delete testimonial
// @route   DELETE /api/testimonials/:id
// @access  Private (Admin)
const deleteTestimonial = async (req, res) => {
    try {
        const testimonial = await Testimonial.findById(req.params.id);

        if (!testimonial) {
            res.status(404);
            throw new Error('Testimonial not found');
        }

        // Delete image from Cloudinary if exists
        if (testimonial.imagePublicId) {
            try {
                await cloudinary.uploader.destroy(testimonial.imagePublicId);
            } catch (cloudError) {
                console.error('Error deleting image from Cloudinary:', cloudError);
            }
        }

        await Testimonial.findByIdAndDelete(req.params.id);

        res.json({ message: 'Testimonial deleted successfully', id: req.params.id });
    } catch (error) {
        res.status(res.statusCode === 200 ? 500 : res.statusCode);
        throw new Error(error.message);
    }
};

// @desc    Get testimonial stats
// @route   GET /api/testimonials/stats
// @access  Private (Admin)
const getTestimonialStats = async (req, res) => {
    try {
        const total = await Testimonial.countDocuments();
        const avgRating = await Testimonial.aggregate([
            { $group: { _id: null, avgRating: { $avg: '$rating' } } }
        ]);

        res.json({
            total,
            avgRating: avgRating.length > 0 ? avgRating[0].avgRating.toFixed(1) : 0,
        });
    } catch (error) {
        res.status(500);
        throw new Error('Server error retrieving stats.');
    }
};

module.exports = {
    getTestimonials,
    getTestimonialById,
    createTestimonial,
    updateTestimonial,
    deleteTestimonial,
    getTestimonialStats,
};
