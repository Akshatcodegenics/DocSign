"use strict";
const express = require('express');
const { getAuditTrail, getAllAudits } = require('../controllers/auditController');
const auth = require('../middleware/auth');
const router = express.Router();
// @route   GET /api/audit/:docId
// @desc    Get audit trail for specific document
// @access  Private
router.get('/:docId', auth, getAuditTrail);
// @route   GET /api/audit/
// @desc    Get all audit entries for user's documents
// @access  Private
router.get('/', auth, getAllAudits);
module.exports = router;
//# sourceMappingURL=audit.js.map