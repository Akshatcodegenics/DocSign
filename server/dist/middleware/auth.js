"use strict";
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const mongoose = require('mongoose');
// In-memory storage for demo mode (shared with authController)
let memoryUsers = [];
// Check if MongoDB is available
const isMongoAvailable = () => {
    return mongoose.connection.readyState === 1;
};
const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) {
            return res.status(401).json({ error: 'Access denied. No token provided.' });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
        const userId = decoded.userId;
        let user;
        if (isMongoAvailable()) {
            // Use MongoDB if available
            user = await User.findById(userId).select('-password');
        }
        else {
            // Use in-memory storage for demo mode
            user = memoryUsers.find(u => u.id === userId || u._id === userId);
            if (user) {
                // Remove password from user object
                const { password, ...userWithoutPassword } = user;
                user = userWithoutPassword;
            }
        }
        if (!user) {
            return res.status(401).json({ error: 'Invalid token - user not found.' });
        }
        // Normalize user object
        req.user = {
            _id: user._id || user.id,
            id: user.id || user._id,
            name: user.name,
            email: user.email
        };
        next();
    }
    catch (error) {
        console.error('Auth middleware error:', error);
        res.status(401).json({ error: 'Invalid token.' });
    }
};
// Export memory users so authController can access it
module.exports = auth;
module.exports.memoryUsers = memoryUsers;
//# sourceMappingURL=auth.js.map