const Team = require('../models/Team');
const cloudinary = require('../config/cloudinary');

// @desc    Get all team members
// @route   GET /api/team
// @access  Public
const getTeamMembers = async (req, res) => {
    try {
        const { department, active } = req.query;
        let query = {};

        if (department) query.department = department;
        if (active !== 'false') query.isActive = true;

        const members = await Team.find(query).sort({ order: 1, createdAt: -1 });
        res.json(members);
    } catch (error) {
        res.status(500);
        throw new Error('Server error retrieving team members.');
    }
};

// @desc    Get single team member
// @route   GET /api/team/:id
// @access  Public
const getTeamMemberById = async (req, res) => {
    try {
        const member = await Team.findById(req.params.id);
        if (!member) {
            res.status(404);
            throw new Error('Team member not found');
        }
        res.json(member);
    } catch (error) {
        res.status(res.statusCode === 200 ? 500 : res.statusCode);
        throw new Error(error.message);
    }
};

// @desc    Create team member
// @route   POST /api/team
// @access  Private (Admin)
const createTeamMember = async (req, res) => {
    try {
        const { name, position, bio, email, phone, department, linkedin, github, twitter, website, order } = req.body;

        if (!name || !position) {
            res.status(400);
            throw new Error('Name and position are required');
        }

        let photo = {};
        if (req.file) {
            photo = {
                url: req.file.path,
                publicId: req.file.filename,
            };
        }

        const member = await Team.create({
            name,
            position,
            bio,
            email,
            phone,
            department: department || 'Development',
            photo,
            socialLinks: {
                linkedin: linkedin || '',
                github: github || '',
                twitter: twitter || '',
                website: website || '',
            },
            order: order || 0,
        });

        res.status(201).json(member);
    } catch (error) {
        res.status(res.statusCode === 200 ? 500 : res.statusCode);
        throw new Error(error.message);
    }
};

// @desc    Update team member
// @route   PUT /api/team/:id
// @access  Private (Admin)
const updateTeamMember = async (req, res) => {
    try {
        const member = await Team.findById(req.params.id);
        if (!member) {
            res.status(404);
            throw new Error('Team member not found');
        }

        const { name, position, bio, email, phone, department, linkedin, github, twitter, website, isActive, order } = req.body;

        member.name = name || member.name;
        member.position = position || member.position;
        member.bio = bio !== undefined ? bio : member.bio;
        member.email = email !== undefined ? email : member.email;
        member.phone = phone !== undefined ? phone : member.phone;
        member.department = department || member.department;
        member.isActive = isActive !== 'false' && isActive !== false;
        member.order = order !== undefined ? order : member.order;

        member.socialLinks = {
            linkedin: linkedin !== undefined ? linkedin : member.socialLinks.linkedin,
            github: github !== undefined ? github : member.socialLinks.github,
            twitter: twitter !== undefined ? twitter : member.socialLinks.twitter,
            website: website !== undefined ? website : member.socialLinks.website,
        };

        if (req.file) {
            if (member.photo?.publicId) {
                try {
                    await cloudinary.uploader.destroy(member.photo.publicId);
                } catch (e) { console.error('Error deleting old photo:', e); }
            }
            member.photo = {
                url: req.file.path,
                publicId: req.file.filename,
            };
        }

        const updatedMember = await member.save();
        res.json(updatedMember);
    } catch (error) {
        res.status(res.statusCode === 200 ? 500 : res.statusCode);
        throw new Error(error.message);
    }
};

// @desc    Delete team member
// @route   DELETE /api/team/:id
// @access  Private (Admin)
const deleteTeamMember = async (req, res) => {
    try {
        const member = await Team.findById(req.params.id);
        if (!member) {
            res.status(404);
            throw new Error('Team member not found');
        }

        if (member.photo?.publicId) {
            try {
                await cloudinary.uploader.destroy(member.photo.publicId);
            } catch (e) { console.error('Error deleting photo:', e); }
        }

        await Team.findByIdAndDelete(req.params.id);
        res.json({ message: 'Team member deleted successfully', id: req.params.id });
    } catch (error) {
        res.status(res.statusCode === 200 ? 500 : res.statusCode);
        throw new Error(error.message);
    }
};

// @desc    Get team stats
// @route   GET /api/team/stats
// @access  Private (Admin)
const getTeamStats = async (req, res) => {
    try {
        const total = await Team.countDocuments();
        const active = await Team.countDocuments({ isActive: true });

        const byDepartment = await Team.aggregate([
            { $match: { isActive: true } },
            { $group: { _id: '$department', count: { $sum: 1 } } }
        ]);

        res.json({ total, active, byDepartment });
    } catch (error) {
        res.status(500);
        throw new Error('Server error retrieving stats.');
    }
};

module.exports = {
    getTeamMembers,
    getTeamMemberById,
    createTeamMember,
    updateTeamMember,
    deleteTeamMember,
    getTeamStats,
};
