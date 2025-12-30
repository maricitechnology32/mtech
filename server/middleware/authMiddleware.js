const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

const protect = async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            // Get token from header
            token = req.headers.authorization.split(' ')[1];

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Get admin from token (exclude password)
            req.admin = await Admin.findById(decoded.id).select('-password');

            if (!req.admin) {
                res.status(401);
                throw new Error('Not authorized - Admin not found');
            }

            next();
        } catch (error) {
            console.error('Auth middleware error:', error.message);
            res.status(401);
            throw new Error('Not authorized - Invalid token');
        }
    }

    if (!token) {
        res.status(401);
        throw new Error('Not authorized - No token provided');
    }
};

module.exports = { protect };
