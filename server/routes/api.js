const express = require('express');
const { uploadDocument, getDocument, signDocument } = require('../controllers/apiController');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');
const { demoMode } = require('../middleware/demoMode');
const router = express.Router();

// @route   POST /api/upload
// @desc    Upload PDF document with multipart/form-data
// @access  Private
router.post('/upload', demoMode, upload.single('pdf'), uploadDocument);

// @route   GET /api/documents/:id
// @desc    Get document metadata and signed URL
// @access  Private
router.get('/documents/:id', demoMode, getDocument);

// @route   POST /api/documents/:id/sign
// @desc    Apply signature to document
// @access  Private
router.post('/documents/:id/sign', demoMode, signDocument);

module.exports = router;
