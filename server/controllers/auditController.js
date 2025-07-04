const Audit = require('../models/Audit');
const Document = require('../models/Document');

const getAuditTrail = async (req, res) => {
  try {
    const { docId } = req.params;

    // Verify document exists and user owns it
    const document = await Document.findById(docId);
    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }

    if (document.uploadedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const auditTrail = await Audit.find({ documentId: docId })
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });

    res.json({
      document: {
        id: document._id,
        title: document.title,
        status: document.status,
      },
      auditTrail,
      count: auditTrail.length,
    });
  } catch (error) {
    console.error('Get audit trail error:', error);
    res.status(500).json({ error: 'Server error fetching audit trail' });
  }
};

const getAllAudits = async (req, res) => {
  try {
    const { status, action, limit = 50, page = 1 } = req.query;

    // Build filter for user's documents only
    const userDocuments = await Document.find({ uploadedBy: req.user._id }).select('_id');
    const documentIds = userDocuments.map(doc => doc._id);

    const filter = { documentId: { $in: documentIds } };

    if (action) {
      filter.action = action;
    }

    const skip = (page - 1) * limit;

    const audits = await Audit.find(filter)
      .populate('documentId', 'title status')
      .populate('userId', 'name email')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip);

    const totalCount = await Audit.countDocuments(filter);

    res.json({
      audits,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalCount / limit),
        totalCount,
        hasNext: skip + audits.length < totalCount,
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    console.error('Get all audits error:', error);
    res.status(500).json({ error: 'Server error fetching audits' });
  }
};

const createAuditEntry = async (documentId, userId, action, details, metadata = {}) => {
  try {
    const audit = new Audit({
      documentId,
      userId,
      action,
      details,
      metadata,
    });

    await audit.save();
    return audit;
  } catch (error) {
    console.error('Create audit entry error:', error);
    throw error;
  }
};

module.exports = {
  getAuditTrail,
  getAllAudits,
  createAuditEntry,
};
