"use strict";
const mongoose = require('mongoose');
const signatureSchema = new mongoose.Schema({
    documentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Document',
        required: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    signerEmail: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
    },
    signerName: {
        type: String,
        required: true,
        trim: true,
    },
    x: {
        type: Number,
        required: true,
    },
    y: {
        type: Number,
        required: true,
    },
    page: {
        type: Number,
        required: true,
        default: 1,
    },
    width: {
        type: Number,
        default: 200,
    },
    height: {
        type: Number,
        default: 60,
    },
    status: {
        type: String,
        enum: ['pending', 'signed', 'rejected'],
        default: 'pending',
    },
    signatureText: {
        type: String,
        trim: true,
    },
    signedAt: {
        type: Date,
    },
    rejectedAt: {
        type: Date,
    },
    rejectionReason: {
        type: String,
        trim: true,
    },
    signatureToken: {
        type: String,
        unique: true,
    },
    ipAddress: {
        type: String,
    },
}, {
    timestamps: true,
});
module.exports = mongoose.model('Signature', signatureSchema);
//# sourceMappingURL=Signature.js.map