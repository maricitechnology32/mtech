const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

// Generate JWT Token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE || '7d',
    });
};

// @desc    Login admin
// @route   POST /api/auth/login
// @access  Public
const loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            res.status(400);
            throw new Error('Please provide email and password');
        }

        // Check for admin (include password for comparison)
        const admin = await Admin.findOne({ email }).select('+password');

        if (!admin) {
            res.status(401);
            throw new Error('Invalid credentials');
        }

        // Check password
        const isMatch = await admin.matchPassword(password);

        if (!isMatch) {
            res.status(401);
            throw new Error('Invalid credentials');
        }

        // Return success with token
        res.json({
            _id: admin._id,
            username: admin.username,
            email: admin.email,
            token: generateToken(admin._id),
        });
    } catch (error) {
        res.status(res.statusCode === 200 ? 500 : res.statusCode);
        throw new Error(error.message);
    }
};

// @desc    Get admin profile
// @route   GET /api/auth/profile
// @access  Private
const getAdminProfile = async (req, res) => {
    try {
        const admin = await Admin.findById(req.admin._id);

        if (!admin) {
            res.status(404);
            throw new Error('Admin not found');
        }

        res.json({
            _id: admin._id,
            username: admin.username,
            email: admin.email,
            createdAt: admin.createdAt,
        });
    } catch (error) {
        res.status(500);
        throw new Error(error.message);
    }
};

// @desc    Register new admin (for initial setup)
// @route   POST /api/auth/register
// @access  Public (should be disabled after initial setup)
const registerAdmin = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Validate input
        if (!username || !email || !password) {
            res.status(400);
            throw new Error('Please provide all required fields');
        }

        // Check if admin exists
        const adminExists = await Admin.findOne({ $or: [{ email }, { username }] });

        if (adminExists) {
            res.status(400);
            throw new Error('Admin with this email or username already exists');
        }

        // Create admin
        const admin = await Admin.create({
            username,
            email,
            password,
        });

        if (admin) {
            res.status(201).json({
                _id: admin._id,
                username: admin.username,
                email: admin.email,
                token: generateToken(admin._id),
            });
        } else {
            res.status(400);
            throw new Error('Invalid admin data');
        }
    } catch (error) {
        res.status(res.statusCode === 200 ? 500 : res.statusCode);
        throw new Error(error.message);
    }
};

// @desc    Update admin password
// @route   PUT /api/auth/password
// @access  Private
const updatePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        const admin = await Admin.findById(req.admin._id).select('+password');

        if (!admin) {
            res.status(404);
            throw new Error('Admin not found');
        }

        // Check current password
        const isMatch = await admin.matchPassword(currentPassword);

        if (!isMatch) {
            res.status(401);
            throw new Error('Current password is incorrect');
        }

        // Update password
        admin.password = newPassword;
        await admin.save();

        res.json({ message: 'Password updated successfully' });
    } catch (error) {
        res.status(res.statusCode === 200 ? 500 : res.statusCode);
        throw new Error(error.message);
    }
};

module.exports = {
    loginAdmin,
    getAdminProfile,
    registerAdmin,
    updatePassword,
};
