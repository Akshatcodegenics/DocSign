"use strict";
const express = require('express');
const { addSignature, getSignatures, signDocument, finalizeDocument, getPublicSignature, } = require('../controllers/signatureController');
const auth = require('../middleware/auth');
const auditLog = require('../middleware/auditLog');
const router = express.Router();
// @route   POST /api/signatures
// @desc    Add signature position to document
// @access  Private
router.post('/', auth, auditLog('signature_added'), addSignature);
// @route   GET /api/signatures/:documentId
// @desc    Get signatures for a document
// @access  Private
router.get('/:documentId', auth, getSignatures);
// @route   POST /api/signatures/finalize/:documentId
// @desc    Finalize document with all signatures
// @access  Private
router.post('/finalize/:documentId', auth, auditLog('document_finalized'), finalizeDocument);
// @route   GET /api/signatures/sign/:token
// @desc    Get signature details by token (public route)
// @access  Public
router.get('/sign/:token', getPublicSignature);
// @route   POST /api/signatures/sign/:token
// @desc    Sign or reject document by token
// @access  Public
router.post('/sign/:token', auditLog('signature_signed'), signDocument);
module.exports = router;
//# sourceMappingURL=signatures.js.map