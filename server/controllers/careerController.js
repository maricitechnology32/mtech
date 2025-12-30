const Career = require('../models/Career');

// @desc    Get all careers
// @route   GET /api/careers
// @access  Public
const getCareers = async (req, res) => {
    try {
        const { active, department, type } = req.query;
        let query = {};

        if (active !== 'false') query.isActive = true;
        if (department) query.department = department;
        if (type) query.type = type;

        const careers = await Career.find(query).sort({ isFeatured: -1, order: 1, createdAt: -1 });
        res.json(careers);
    } catch (error) {
        res.status(500).json({ message: 'Server error retrieving careers.' });
    }
};

// @desc    Get single career
// @route   GET /api/careers/:id
// @access  Public
const getCareerById = async (req, res) => {
    try {
        const career = await Career.findById(req.params.id);
        if (!career) {
            return res.status(404).json({ message: 'Career not found' });
        }
        res.json(career);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create career
// @route   POST /api/careers
// @access  Private (Admin)
const createCareer = async (req, res) => {
    try {
        const {
            title, department, location, type, experience,
            salaryMin, salaryMax, salaryCurrency, salaryVisible,
            description, requirements, responsibilities, benefits, skills,
            applicationEmail, applicationUrl, deadline, isFeatured, order
        } = req.body;

        if (!title || !description || !location) {
            return res.status(400).json({ message: 'Title, description, and location are required' });
        }

        // Parse arrays from comma-separated strings
        const parseArray = (val) => {
            if (!val) return [];
            if (Array.isArray(val)) return val;
            return val.split(',').map(s => s.trim()).filter(s => s);
        };

        const career = await Career.create({
            title,
            department: department || 'Engineering',
            location,
            type: type || 'Full-time',
            experience: experience || 'Mid Level',
            salary: {
                min: salaryMin ? Number(salaryMin) : undefined,
                max: salaryMax ? Number(salaryMax) : undefined,
                currency: salaryCurrency || 'USD',
                isVisible: salaryVisible === 'true' || salaryVisible === true,
            },
            description,
            requirements: parseArray(requirements),
            responsibilities: parseArray(responsibilities),
            benefits: parseArray(benefits),
            skills: parseArray(skills),
            applicationEmail,
            applicationUrl,
            deadline: deadline ? new Date(deadline) : undefined,
            isFeatured: isFeatured === 'true' || isFeatured === true,
            order: order ? Number(order) : 0,
        });

        res.status(201).json(career);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update career
// @route   PUT /api/careers/:id
// @access  Private (Admin)
const updateCareer = async (req, res) => {
    try {
        const career = await Career.findById(req.params.id);
        if (!career) {
            return res.status(404).json({ message: 'Career not found' });
        }

        const {
            title, department, location, type, experience,
            salaryMin, salaryMax, salaryCurrency, salaryVisible,
            description, requirements, responsibilities, benefits, skills,
            applicationEmail, applicationUrl, deadline, isActive, isFeatured, order
        } = req.body;

        const parseArray = (val) => {
            if (!val) return undefined;
            if (Array.isArray(val)) return val;
            return val.split(',').map(s => s.trim()).filter(s => s);
        };

        if (title) career.title = title;
        if (department) career.department = department;
        if (location) career.location = location;
        if (type) career.type = type;
        if (experience) career.experience = experience;
        if (description) career.description = description;
        if (applicationEmail !== undefined) career.applicationEmail = applicationEmail;
        if (applicationUrl !== undefined) career.applicationUrl = applicationUrl;
        if (deadline !== undefined) career.deadline = deadline ? new Date(deadline) : null;
        if (order !== undefined) career.order = Number(order);

        if (salaryMin !== undefined || salaryMax !== undefined || salaryCurrency !== undefined || salaryVisible !== undefined) {
            career.salary = {
                min: salaryMin !== undefined ? Number(salaryMin) : career.salary?.min,
                max: salaryMax !== undefined ? Number(salaryMax) : career.salary?.max,
                currency: salaryCurrency || career.salary?.currency || 'USD',
                isVisible: salaryVisible !== undefined ? (salaryVisible === 'true' || salaryVisible === true) : career.salary?.isVisible,
            };
        }

        const reqArr = parseArray(requirements);
        if (reqArr) career.requirements = reqArr;
        const respArr = parseArray(responsibilities);
        if (respArr) career.responsibilities = respArr;
        const benArr = parseArray(benefits);
        if (benArr) career.benefits = benArr;
        const skillArr = parseArray(skills);
        if (skillArr) career.skills = skillArr;

        if (isActive !== undefined) career.isActive = isActive !== 'false' && isActive !== false;
        if (isFeatured !== undefined) career.isFeatured = isFeatured === 'true' || isFeatured === true;

        const updatedCareer = await career.save();
        res.json(updatedCareer);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete career
// @route   DELETE /api/careers/:id
// @access  Private (Admin)
const deleteCareer = async (req, res) => {
    try {
        const career = await Career.findById(req.params.id);
        if (!career) {
            return res.status(404).json({ message: 'Career not found' });
        }

        await Career.findByIdAndDelete(req.params.id);
        res.json({ message: 'Career deleted successfully', id: req.params.id });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get career stats
// @route   GET /api/careers/stats
// @access  Private (Admin)
const getCareerStats = async (req, res) => {
    try {
        const total = await Career.countDocuments();
        const active = await Career.countDocuments({ isActive: true });
        const featured = await Career.countDocuments({ isFeatured: true });

        const byDepartment = await Career.aggregate([
            { $match: { isActive: true } },
            { $group: { _id: '$department', count: { $sum: 1 } } }
        ]);

        res.json({ total, active, featured, byDepartment });
    } catch (error) {
        res.status(500).json({ message: 'Server error retrieving stats.' });
    }
};

module.exports = {
    getCareers,
    getCareerById,
    createCareer,
    updateCareer,
    deleteCareer,
    getCareerStats,
};
