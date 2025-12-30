const Project = require('../models/Project');
const cloudinary = require('../config/cloudinary');

// @desc    Get all projects
// @route   GET /api/projects
// @access  Public
const getProjects = async (req, res) => {
    try {
        const { featured, category, active } = req.query;
        let query = {};

        if (featured === 'true') query.isFeatured = true;
        if (category) query.category = category;
        if (active !== 'false') query.isActive = true;

        const projects = await Project.find(query).sort({ order: 1, createdAt: -1 });
        res.json(projects);
    } catch (error) {
        res.status(500);
        throw new Error('Server error retrieving projects.');
    }
};

// @desc    Get single project
// @route   GET /api/projects/:id
// @access  Public
const getProjectById = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project) {
            res.status(404);
            throw new Error('Project not found');
        }
        res.json(project);
    } catch (error) {
        res.status(res.statusCode === 200 ? 500 : res.statusCode);
        throw new Error(error.message);
    }
};

// @desc    Create project
// @route   POST /api/projects
// @access  Private (Admin)
const createProject = async (req, res) => {
    try {
        const {
            title, description, shortDescription, client, category,
            technologies, liveUrl, githubUrl, isFeatured, startDate, endDate, order
        } = req.body;

        if (!title || !description) {
            res.status(400);
            throw new Error('Title and description are required');
        }

        let featuredImage = {};
        if (req.file) {
            featuredImage = {
                url: req.file.path,
                publicId: req.file.filename,
            };
        }

        // Parse technologies if it's a string
        let techArray = [];
        if (technologies) {
            techArray = typeof technologies === 'string'
                ? technologies.split(',').map(t => t.trim())
                : technologies;
        }

        const project = await Project.create({
            title,
            description,
            shortDescription,
            client,
            category,
            technologies: techArray,
            featuredImage,
            liveUrl,
            githubUrl,
            isFeatured: isFeatured === 'true' || isFeatured === true,
            startDate,
            endDate,
            order: order || 0,
        });

        res.status(201).json(project);
    } catch (error) {
        res.status(res.statusCode === 200 ? 500 : res.statusCode);
        throw new Error(error.message);
    }
};

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private (Admin)
const updateProject = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project) {
            res.status(404);
            throw new Error('Project not found');
        }

        const {
            title, description, shortDescription, client, category,
            technologies, liveUrl, githubUrl, isFeatured, isActive, startDate, endDate, order
        } = req.body;

        // Update fields
        project.title = title || project.title;
        project.description = description || project.description;
        project.shortDescription = shortDescription !== undefined ? shortDescription : project.shortDescription;
        project.client = client !== undefined ? client : project.client;
        project.category = category || project.category;
        project.liveUrl = liveUrl !== undefined ? liveUrl : project.liveUrl;
        project.githubUrl = githubUrl !== undefined ? githubUrl : project.githubUrl;
        project.isFeatured = isFeatured === 'true' || isFeatured === true;
        project.isActive = isActive !== 'false' && isActive !== false;
        project.startDate = startDate || project.startDate;
        project.endDate = endDate || project.endDate;
        project.order = order !== undefined ? order : project.order;

        // Parse technologies
        if (technologies) {
            project.technologies = typeof technologies === 'string'
                ? technologies.split(',').map(t => t.trim())
                : technologies;
        }

        // Handle image update
        if (req.file) {
            // Delete old image
            if (project.featuredImage?.publicId) {
                try {
                    await cloudinary.uploader.destroy(project.featuredImage.publicId);
                } catch (e) { console.error('Error deleting old image:', e); }
            }
            project.featuredImage = {
                url: req.file.path,
                publicId: req.file.filename,
            };
        }

        const updatedProject = await project.save();
        res.json(updatedProject);
    } catch (error) {
        res.status(res.statusCode === 200 ? 500 : res.statusCode);
        throw new Error(error.message);
    }
};

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private (Admin)
const deleteProject = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project) {
            res.status(404);
            throw new Error('Project not found');
        }

        // Delete images from Cloudinary
        if (project.featuredImage?.publicId) {
            try {
                await cloudinary.uploader.destroy(project.featuredImage.publicId);
            } catch (e) { console.error('Error deleting image:', e); }
        }

        await Project.findByIdAndDelete(req.params.id);
        res.json({ message: 'Project deleted successfully', id: req.params.id });
    } catch (error) {
        res.status(res.statusCode === 200 ? 500 : res.statusCode);
        throw new Error(error.message);
    }
};

// @desc    Get project stats
// @route   GET /api/projects/stats
// @access  Private (Admin)
const getProjectStats = async (req, res) => {
    try {
        const total = await Project.countDocuments();
        const active = await Project.countDocuments({ isActive: true });
        const featured = await Project.countDocuments({ isFeatured: true });

        const byCategory = await Project.aggregate([
            { $group: { _id: '$category', count: { $sum: 1 } } }
        ]);

        res.json({ total, active, featured, byCategory });
    } catch (error) {
        res.status(500);
        throw new Error('Server error retrieving stats.');
    }
};

module.exports = {
    getProjects,
    getProjectById,
    createProject,
    updateProject,
    deleteProject,
    getProjectStats,
};
