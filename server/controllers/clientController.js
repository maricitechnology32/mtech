const Client = require('../models/Client');
const cloudinary = require('../config/cloudinary');

// @desc    Get all clients
// @route   GET /api/clients
// @access  Public
const getClients = async (req, res) => {
    try {
        const { featured, active } = req.query;
        let query = {};

        if (featured === 'true') query.isFeatured = true;
        if (active !== 'false') query.isActive = true;

        const clients = await Client.find(query).sort({ order: 1, createdAt: -1 });
        res.json(clients);
    } catch (error) {
        res.status(500);
        throw new Error('Server error retrieving clients.');
    }
};

// @desc    Get single client
// @route   GET /api/clients/:id
// @access  Public
const getClientById = async (req, res) => {
    try {
        const client = await Client.findById(req.params.id);
        if (!client) {
            res.status(404);
            throw new Error('Client not found');
        }
        res.json(client);
    } catch (error) {
        res.status(res.statusCode === 200 ? 500 : res.statusCode);
        throw new Error(error.message);
    }
};

// @desc    Create client
// @route   POST /api/clients
// @access  Private (Admin)
const createClient = async (req, res) => {
    try {
        const { name, industry, website, description, isFeatured, order } = req.body;

        if (!name) {
            res.status(400);
            throw new Error('Client name is required');
        }

        let logo = {};
        if (req.file) {
            logo = {
                url: req.file.path,
                publicId: req.file.filename,
            };
        }

        const client = await Client.create({
            name,
            industry: industry || 'Technology',
            logo,
            website,
            description,
            isFeatured: isFeatured === 'true' || isFeatured === true,
            order: order || 0,
        });

        res.status(201).json(client);
    } catch (error) {
        res.status(res.statusCode === 200 ? 500 : res.statusCode);
        throw new Error(error.message);
    }
};

// @desc    Update client
// @route   PUT /api/clients/:id
// @access  Private (Admin)
const updateClient = async (req, res) => {
    try {
        const client = await Client.findById(req.params.id);
        if (!client) {
            res.status(404);
            throw new Error('Client not found');
        }

        const { name, industry, website, description, isFeatured, isActive, order } = req.body;

        client.name = name || client.name;
        client.industry = industry || client.industry;
        client.website = website !== undefined ? website : client.website;
        client.description = description !== undefined ? description : client.description;
        client.isFeatured = isFeatured === 'true' || isFeatured === true;
        client.isActive = isActive !== 'false' && isActive !== false;
        client.order = order !== undefined ? order : client.order;

        if (req.file) {
            if (client.logo?.publicId) {
                try {
                    await cloudinary.uploader.destroy(client.logo.publicId);
                } catch (e) { console.error('Error deleting old logo:', e); }
            }
            client.logo = {
                url: req.file.path,
                publicId: req.file.filename,
            };
        }

        const updatedClient = await client.save();
        res.json(updatedClient);
    } catch (error) {
        res.status(res.statusCode === 200 ? 500 : res.statusCode);
        throw new Error(error.message);
    }
};

// @desc    Delete client
// @route   DELETE /api/clients/:id
// @access  Private (Admin)
const deleteClient = async (req, res) => {
    try {
        const client = await Client.findById(req.params.id);
        if (!client) {
            res.status(404);
            throw new Error('Client not found');
        }

        if (client.logo?.publicId) {
            try {
                await cloudinary.uploader.destroy(client.logo.publicId);
            } catch (e) { console.error('Error deleting logo:', e); }
        }

        await Client.findByIdAndDelete(req.params.id);
        res.json({ message: 'Client deleted successfully', id: req.params.id });
    } catch (error) {
        res.status(res.statusCode === 200 ? 500 : res.statusCode);
        throw new Error(error.message);
    }
};

// @desc    Get client stats
// @route   GET /api/clients/stats
// @access  Private (Admin)
const getClientStats = async (req, res) => {
    try {
        const total = await Client.countDocuments();
        const active = await Client.countDocuments({ isActive: true });
        const featured = await Client.countDocuments({ isFeatured: true });

        const byIndustry = await Client.aggregate([
            { $match: { isActive: true } },
            { $group: { _id: '$industry', count: { $sum: 1 } } }
        ]);

        res.json({ total, active, featured, byIndustry });
    } catch (error) {
        res.status(500);
        throw new Error('Server error retrieving stats.');
    }
};

module.exports = {
    getClients,
    getClientById,
    createClient,
    updateClient,
    deleteClient,
    getClientStats,
};
