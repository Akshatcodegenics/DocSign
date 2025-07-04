"use strict";
const mongoose = require('mongoose');
const documentSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    filename: {
        type: String,
        required: true,
    },
    originalName: {
        type: String,
        required: true,
    },
    filePath: {
        type: String,
        required: true,
    },
    fileSize: {
        type: Number,
        required: true,
    },
    mimeType: {
        type: String,
        required: true,
    },
    uploadedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    status: {
        type: String,
        enum: ['pending', 'signed', 'rejected'],
        default: 'pending',
    },
    pages: {
        type: Number,
        default: 1,
    },
    documentType: {
        type: String,
        enum: ['pdf', 'word', 'excel', 'powerpoint', 'text', 'csv', 'image'],
        required: true,
    },
    processingStatus: {
        type: String,
        enum: ['processing', 'ready', 'error'],
        default: 'processing',
    },
    processingError: {
        type: String,
    },
    metadata: {
        author: String,
        subject: String,
        keywords: String,
        creationDate: Date,
        modificationDate: Date,
        dimensions: {
            width: Number,
            height: Number,
        },
    },
    supportsBiometricSignatures: {
        type: Boolean,
        default: true,
    },
    supportsBlockchainAudit: {
        type: Boolean,
        default: true,
    },
}, {
    timestamps: true,
});
module.exports = mongoose.model('Document', documentSchema);
//# sourceMappingURL=Document.js.map