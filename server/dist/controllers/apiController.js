"use strict";
// Import models - will be overridden in demo mode
let Document = require('../models/Document');
let Signature = require('../models/Signature');
const { MockDocument, MockSignature } = require('../middleware/demoMode');
const { PDFDocument, rgb } = require('pdf-lib');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
// POST /api/upload - Upload PDF document
const uploadDocument = async (req, res, next) => {
    // Use mock models in demo mode
    if (req.isDemoMode) {
        Document = MockDocument;
        Signature = MockSignature;
    }
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'No file uploaded',
            });
        }
        const { title } = req.body;
        if (!title) {
            return res.status(400).json({
                success: false,
                message: 'Document title is required',
            });
        }
        const document = new Document({
            title,
            filename: req.file.filename,
            originalName: req.file.originalname,
            filePath: req.file.path,
            fileSize: req.file.size,
            mimeType: req.file.mimetype,
            uploadedBy: req.user._id,
        });
        await document.save();
        res.status(201).json({
            success: true,
            message: 'Document uploaded successfully',
            data: {
                id: document._id,
                title: document.title,
                filename: document.filename,
                originalName: document.originalName,
                filePath: req.file.path,
                s3Key: req.file.path, // For now, using file path as S3 key placeholder
                fileSize: document.fileSize,
                status: document.status,
                createdAt: document.createdAt,
            },
        });
    }
    catch (error) {
        next(error);
    }
};
// GET /api/documents/:id - Get document metadata and signed URL
const getDocument = async (req, res, next) => {
    // Use mock models in demo mode
    if (req.isDemoMode) {
        Document = MockDocument;
        Signature = MockSignature;
    }
    try {
        const document = await Document.findById(req.params.id)
            .populate('uploadedBy', 'name email');
        if (!document) {
            return res.status(404).json({
                success: false,
                message: 'Document not found',
            });
        }
        // Check if user has access to the document
        if (document.uploadedBy._id.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Unauthorized access to document',
            });
        }
        // Generate signed URL (for now, using local file path)
        const signedUrl = `${req.protocol}://${req.get('host')}/uploads/${document.filename}`;
        // Get signature count for this document
        const signatureCount = await Signature.countDocuments({ documentId: document._id });
        res.json({
            success: true,
            message: 'Document retrieved successfully',
            data: {
                id: document._id,
                title: document.title,
                filename: document.filename,
                originalName: document.originalName,
                fileSize: document.fileSize,
                mimeType: document.mimeType,
                status: document.status,
                pages: document.pages,
                signatureCount,
                signedUrl,
                uploadedBy: {
                    id: document.uploadedBy._id,
                    name: document.uploadedBy.name,
                    email: document.uploadedBy.email,
                },
                createdAt: document.createdAt,
                updatedAt: document.updatedAt,
            },
        });
    }
    catch (error) {
        next(error);
    }
};
// POST /api/documents/:id/sign - Apply signature to document
const signDocument = async (req, res, next) => {
    // Use mock models in demo mode
    if (req.isDemoMode) {
        Document = MockDocument;
        Signature = MockSignature;
    }
    try {
        const { x, y, page, width, height, signerEmail, signerName, signatureText } = req.body;
        if (!x || !y || !page || !signerEmail || !signerName) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields: x, y, page, signerEmail, signerName',
            });
        }
        const document = await Document.findById(req.params.id);
        if (!document) {
            return res.status(404).json({
                success: false,
                message: 'Document not found',
            });
        }
        // Check if user has access to the document
        if (document.uploadedBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Unauthorized access to document',
            });
        }
        // For now, this is a stub implementation
        // In production, you would:
        // 1. Validate the signature payload
        // 2. Apply the signature to the PDF
        // 3. Store the signature in the database
        // 4. Return the updated file
        const signatureToken = crypto.randomBytes(32).toString('hex');
        // Create signature record
        const signature = new Signature({
            documentId: document._id,
            userId: req.user._id,
            x: parseFloat(x),
            y: parseFloat(y),
            page: parseInt(page),
            width: width ? parseFloat(width) : 200,
            height: height ? parseFloat(height) : 60,
            signerEmail,
            signerName,
            signatureToken,
            signatureText: signatureText || signerName,
            status: 'signed', // Auto-approve for now
            signedAt: new Date(),
            ipAddress: req.ip,
        });
        await signature.save();
        // Stub: Apply signature to PDF (simplified version)
        try {
            const pdfBytes = fs.readFileSync(document.filePath);
            const pdfDoc = await PDFDocument.load(pdfBytes);
            const pages = pdfDoc.getPages();
            const pdfPage = pages[page - 1];
            if (pdfPage) {
                const { height: pageHeight } = pdfPage.getSize();
                const pdfY = pageHeight - y - (height || 60);
                pdfPage.drawText(signatureText || signerName, {
                    x: parseFloat(x),
                    y: pdfY,
                    size: 12,
                    color: rgb(0, 0, 0),
                });
                // Save updated PDF
                const updatedPdfBytes = await pdfDoc.save();
                const updatedFilePath = document.filePath.replace('.pdf', '_signed.pdf');
                fs.writeFileSync(updatedFilePath, updatedPdfBytes);
                // Update document status
                document.status = 'signed';
                await document.save();
                res.json({
                    success: true,
                    message: 'Signature applied successfully',
                    data: {
                        documentId: document._id,
                        signatureId: signature._id,
                        updatedFilePath,
                        signedUrl: `${req.protocol}://${req.get('host')}/uploads/${path.basename(updatedFilePath)}`,
                        signature: {
                            x: signature.x,
                            y: signature.y,
                            page: signature.page,
                            width: signature.width,
                            height: signature.height,
                            signerEmail: signature.signerEmail,
                            signerName: signature.signerName,
                            signedAt: signature.signedAt,
                            status: signature.status,
                        },
                    },
                });
            }
            else {
                throw new Error('Invalid page number');
            }
        }
        catch (pdfError) {
            console.error('PDF processing error:', pdfError);
            res.json({
                success: true,
                message: 'Signature recorded successfully (PDF processing failed)',
                data: {
                    documentId: document._id,
                    signatureId: signature._id,
                    signature: {
                        x: signature.x,
                        y: signature.y,
                        page: signature.page,
                        width: signature.width,
                        height: signature.height,
                        signerEmail: signature.signerEmail,
                        signerName: signature.signerName,
                        signedAt: signature.signedAt,
                        status: signature.status,
                    },
                },
            });
        }
    }
    catch (error) {
        next(error);
    }
};
module.exports = {
    uploadDocument,
    getDocument,
    signDocument,
};
//# sourceMappingURL=apiController.js.map