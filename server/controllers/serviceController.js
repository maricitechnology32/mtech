const Service = require('../models/Service');
const cloudinary = require('../config/cloudinary');

// @desc    Get all services
// @route   GET /api/services
// @access  Public
const getServices = async (req, res) => {
    try {
        const { active } = req.query;
        let query = {};
        if (active !== 'false') query.isActive = true;

        const services = await Service.find(query).sort({ order: 1, createdAt: -1 });
        res.json(services);
    } catch (error) {
        res.status(500);
        throw new Error('Server error retrieving services.');
    }
};

// @desc    Get single service
// @route   GET /api/services/:id
// @access  Public
const getServiceById = async (req, res) => {
    try {
        const service = await Service.findById(req.params.id);
        if (!service) {
            res.status(404);
            throw new Error('Service not found');
        }
        res.json(service);
    } catch (error) {
        res.status(res.statusCode === 200 ? 500 : res.statusCode);
        throw new Error(error.message);
    }
};

// @desc    Create service
// @route   POST /api/services
// @access  Private (Admin)
const createService = async (req, res) => {
    try {
        const { title, description, shortDescription, icon, features, gradient, order } = req.body;

        if (!title || !description) {
            res.status(400);
            throw new Error('Title and description are required');
        }

        let image = {};
        if (req.file) {
            image = {
                url: req.file.path,
                publicId: req.file.filename,
            };
        }

        // Parse features if string
        let featuresArray = [];
        if (features) {
            featuresArray = typeof features === 'string'
                ? features.split(',').map(f => f.trim())
                : features;
        }

        const service = await Service.create({
            title,
            description,
            shortDescription,
            icon: icon || 'Code2',
            features: featuresArray,
            gradient: gradient || 'from-blue-500 to-blue-700',
            image,
            order: order || 0,
        });

        res.status(201).json(service);
    } catch (error) {
        res.status(res.statusCode === 200 ? 500 : res.statusCode);
        throw new Error(error.message);
    }
};

// @desc    Update service
// @route   PUT /api/services/:id
// @access  Private (Admin)
const updateService = async (req, res) => {
    try {
        const service = await Service.findById(req.params.id);
        if (!service) {
            res.status(404);
            throw new Error('Service not found');
        }

        const { title, description, shortDescription, icon, features, gradient, isActive, order } = req.body;

        service.title = title || service.title;
        service.description = description || service.description;
        service.shortDescription = shortDescription !== undefined ? shortDescription : service.shortDescription;
        service.icon = icon || service.icon;
        service.gradient = gradient || service.gradient;
        service.isActive = isActive !== 'false' && isActive !== false;
        service.order = order !== undefined ? order : service.order;

        if (features) {
            service.features = typeof features === 'string'
                ? features.split(',').map(f => f.trim())
                : features;
        }

        if (req.file) {
            if (service.image?.publicId) {
                try {
                    await cloudinary.uploader.destroy(service.image.publicId);
                } catch (e) { console.error('Error deleting old image:', e); }
            }
            service.image = {
                url: req.file.path,
                publicId: req.file.filename,
            };
        }

        const updatedService = await service.save();
        res.json(updatedService);
    } catch (error) {
        res.status(res.statusCode === 200 ? 500 : res.statusCode);
        throw new Error(error.message);
    }
};

// @desc    Delete service
// @route   DELETE /api/services/:id
// @access  Private (Admin)
const deleteService = async (req, res) => {
    try {
        const service = await Service.findById(req.params.id);
        if (!service) {
            res.status(404);
            throw new Error('Service not found');
        }

        if (service.image?.publicId) {
            try {
                await cloudinary.uploader.destroy(service.image.publicId);
            } catch (e) { console.error('Error deleting image:', e); }
        }

        await Service.findByIdAndDelete(req.params.id);
        res.json({ message: 'Service deleted successfully', id: req.params.id });
    } catch (error) {
        res.status(res.statusCode === 200 ? 500 : res.statusCode);
        throw new Error(error.message);
    }
};

// @desc    Get service stats
// @route   GET /api/services/stats
// @access  Private (Admin)
const getServiceStats = async (req, res) => {
    try {
        const total = await Service.countDocuments();
        const active = await Service.countDocuments({ isActive: true });
        res.json({ total, active });
    } catch (error) {
        res.status(500);
        throw new Error('Server error retrieving stats.');
    }
};

module.exports = {
    getServices,
    getServiceById,
    createService,
    updateService,
    deleteService,
    getServiceStats,
};
