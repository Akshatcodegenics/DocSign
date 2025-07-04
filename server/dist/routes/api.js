"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const apiController_1 = require("../controllers/apiController");
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');
const router = express_1.default.Router();
// @route   POST /api/upload
// @desc    Upload PDF document with multipart/form-data
// @access  Private
router.post('/upload', auth, upload.single('pdf'), apiController_1.uploadDocument);
// @route   GET /api/documents/:id
// @desc    Get document metadata and signed URL
// @access  Private
router.get('/documents/:id', auth, apiController_1.getDocument);
// @route   POST /api/documents/:id/sign
// @desc    Apply signature to document
// @access  Private
router.post('/documents/:id/sign', auth, apiController_1.signDocument);
exports.default = router;
//# sourceMappingURL=api.js.map