const express = require('express');
const {
  uploadDocument,
  getDocuments,
  getDocument,
  serveDocument,
  deleteDocument,
} = require('../controllers/documentController');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');
const auditLog = require('../middleware/auditLog');
const router = express.Router();

// @route   POST /api/docs/upload
// @desc    Upload a PDF document
// @access  Private
router.post('/upload', auth, upload.single('document'), auditLog('document_uploaded'), uploadDocument);

// @route   GET /api/docs/
// @desc    Get all user documents
// @access  Private
router.get('/', auth, getDocuments);

// @route   GET /api/docs/:id
// @desc    Get specific document details
// @access  Private
router.get('/:id', auth, getDocument);

// @route   GET /api/docs/:id/file
// @desc    Serve document file
// @access  Private
router.get('/:id/file', auth, serveDocument);

// @route   DELETE /api/docs/:id
// @desc    Delete a document
// @access  Private
router.delete('/:id', auth, auditLog('document_deleted'), deleteDocument);

module.exports = router;
