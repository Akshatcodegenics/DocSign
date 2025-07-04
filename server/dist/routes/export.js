"use strict";
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { exportAsPDF, exportAsImage, exportAsJSON, exportAuditTrail, getExportFormats, exportBlockchainAudit } = require('../controllers/exportController');
// Get available export formats
router.get('/formats', auth, getExportFormats);
// Export document as PDF
router.get('/:documentId/pdf', auth, exportAsPDF);
// Export document as image (PNG, JPG, WebP)
router.get('/:documentId/image/:format', auth, exportAsImage);
// Export signature data as JSON
router.get('/:documentId/json', auth, exportAsJSON);
// Export audit trail
router.get('/:documentId/audit', auth, exportAuditTrail);
// Export blockchain audit trail
router.get('/:documentId/blockchain', auth, exportBlockchainAudit);
module.exports = router;
//# sourceMappingURL=export.js.map