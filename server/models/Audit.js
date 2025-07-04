const mongoose = require('mongoose');

const auditSchema = new mongoose.Schema({
  documentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Document',
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  action: {
    type: String,
    required: true,
    enum: ['document_uploaded', 'signature_added', 'signature_signed', 'signature_rejected', 'document_finalized'],
  },
  details: {
    type: String,
    trim: true,
  },
  ipAddress: {
    type: String,
  },
  userAgent: {
    type: String,
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Audit', auditSchema);
