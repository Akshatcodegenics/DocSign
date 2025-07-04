const express = require('express');
const { register, login, validateToken } = require('../controllers/authController');
const router = express.Router();

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', register);

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', login);

// @route   GET /api/auth/validate
// @desc    Validate token
// @access  Private
router.get('/validate', validateToken);

module.exports = router;
