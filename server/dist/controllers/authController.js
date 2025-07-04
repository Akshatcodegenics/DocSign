"use strict";
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
// Use shared memory storage from auth middleware
const authMiddleware = require('../middleware/auth');
const memoryUsers = authMiddleware.memoryUsers;
const generateToken = (userId) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET || 'your-secret-key', { expiresIn: '7d' });
};
// Check if MongoDB is available
const isMongoAvailable = () => {
    const mongoose = require('mongoose');
    return mongoose.connection.readyState === 1;
};
const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        console.log('Registration attempt:', { name, email, passwordLength: password?.length });
        if (!name || !email || !password) {
            return res.status(400).json({ error: 'Please provide all required fields' });
        }
        if (password.length < 6) {
            return res.status(400).json({ error: 'Password must be at least 6 characters long' });
        }
        let existingUser;
        let userId;
        let hashedPassword;
        if (isMongoAvailable()) {
            // Use MongoDB if available
            existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ error: 'User already exists with this email' });
            }
            const user = new User({ name, email, password });
            await user.save();
            userId = user._id;
        }
        else {
            // Use in-memory storage for demo mode
            console.log('MongoDB not available, using demo mode');
            existingUser = memoryUsers.find(u => u.email === email);
            if (existingUser) {
                return res.status(400).json({ error: 'User already exists with this email' });
            }
            // Hash password manually for demo mode
            hashedPassword = await bcrypt.hash(password, 10);
            userId = Date.now().toString(); // Simple ID generation
            const user = {
                id: userId,
                name,
                email,
                password: hashedPassword,
                createdAt: new Date()
            };
            memoryUsers.push(user);
            console.log('User registered in demo mode:', { id: userId, name, email });
        }
        const token = generateToken(userId);
        res.status(201).json({
            message: 'User registered successfully',
            user: {
                id: userId,
                name,
                email,
            },
            token,
        });
    }
    catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Server error during registration' });
    }
};
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log('Login attempt:', { email, passwordLength: password?.length });
        if (!email || !password) {
            return res.status(400).json({ error: 'Please provide email and password' });
        }
        let user;
        let isMatch = false;
        if (isMongoAvailable()) {
            // Use MongoDB if available
            user = await User.findOne({ email });
            if (!user) {
                return res.status(400).json({ error: 'Invalid credentials' });
            }
            isMatch = await user.comparePassword(password);
        }
        else {
            // Use in-memory storage for demo mode
            console.log('MongoDB not available, using demo mode');
            console.log('Available users:', memoryUsers.map(u => ({ id: u.id, email: u.email })));
            user = memoryUsers.find(u => u.email === email);
            if (!user) {
                // For demo purposes, create a default user if none exists
                if (email === 'demo@example.com' && password === 'demo123') {
                    const defaultUser = {
                        id: 'demo-user-1',
                        name: 'Demo User',
                        email: 'demo@example.com',
                        password: await bcrypt.hash('demo123', 10),
                        createdAt: new Date()
                    };
                    memoryUsers.push(defaultUser);
                    user = defaultUser;
                    isMatch = true;
                    console.log('Created default demo user');
                }
                else {
                    return res.status(400).json({ error: 'Invalid credentials. Try demo@example.com / demo123' });
                }
            }
            else {
                isMatch = await bcrypt.compare(password, user.password);
            }
        }
        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }
        const token = generateToken(user.id || user._id);
        console.log('Login successful:', { userId: user.id || user._id, email: user.email });
        res.json({
            message: 'Login successful',
            user: {
                id: user.id || user._id,
                name: user.name,
                email: user.email,
            },
            token,
        });
    }
    catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Server error during login' });
    }
};
const validateToken = async (req, res) => {
    try {
        const token = req.headers.authorization?.replace('Bearer ', '');
        if (!token) {
            return res.status(401).json({ valid: false, error: 'No token provided' });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
        const userId = decoded.userId;
        let user;
        if (isMongoAvailable()) {
            user = await User.findById(userId).select('-password');
        }
        else {
            // Use in-memory storage for demo mode
            user = memoryUsers.find(u => u.id === userId || u._id === userId);
            if (user) {
                // Remove password from response
                const { password, ...userWithoutPassword } = user;
                user = userWithoutPassword;
            }
        }
        if (!user) {
            return res.status(401).json({ valid: false, error: 'User not found' });
        }
        res.json({
            valid: true,
            user: {
                id: user.id || user._id,
                name: user.name,
                email: user.email,
            }
        });
    }
    catch (error) {
        console.error('Token validation error:', error);
        res.status(401).json({ valid: false, error: 'Invalid token' });
    }
};
module.exports = { register, login, validateToken };
//# sourceMappingURL=authController.js.map