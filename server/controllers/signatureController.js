const Signature = require('../models/Signature');
const Document = require('../models/Document');
const { PDFDocument, rgb } = require('pdf-lib');
const fs = require('fs');
const crypto = require('crypto');

const addSignature = async (req, res) => {
  try {
    const { documentId, x, y, page, width, height, signerEmail, signerName } = req.body;

    if (!documentId || !x || !y || !page || !signerEmail || !signerName) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const document = await Document.findById(documentId);
    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }

    if (document.uploadedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const signatureToken = crypto.randomBytes(32).toString('hex');

    const signature = new Signature({
      documentId,
      userId: req.user._id,
      x,
      y,
      page,
      width: width || 200,
      height: height || 60,
      signerEmail,
      signerName,
      signatureToken,
      ipAddress: req.ip,
    });

    await signature.save();

    res.status(201).json({
      message: 'Signature position added successfully',
      signature: {
        id: signature._id,
        x: signature.x,
        y: signature.y,
        page: signature.page,
        width: signature.width,
        height: signature.height,
        signerEmail: signature.signerEmail,
        signerName: signature.signerName,
        status: signature.status,
        signatureToken: signature.signatureToken,
      },
    });
  } catch (error) {
    console.error('Add signature error:', error);
    res.status(500).json({ error: 'Server error adding signature' });
  }
};

const getSignatures = async (req, res) => {
  try {
    const { documentId } = req.params;

    const document = await Document.findById(documentId);
    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }

    if (document.uploadedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const signatures = await Signature.find({ documentId })
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });

    res.json({
      signatures,
      count: signatures.length,
    });
  } catch (error) {
    console.error('Get signatures error:', error);
    res.status(500).json({ error: 'Server error fetching signatures' });
  }
};

const signDocument = async (req, res) => {
  try {
    const { token } = req.params;
    const { signatureText, action } = req.body;

    if (!action || !['sign', 'reject'].includes(action)) {
      return res.status(400).json({ error: 'Invalid action' });
    }

    const signature = await Signature.findOne({ signatureToken: token });
    if (!signature) {
      return res.status(404).json({ error: 'Invalid signature token' });
    }

    if (signature.status !== 'pending') {
      return res.status(400).json({ error: 'Signature already processed' });
    }

    if (action === 'sign') {
      if (!signatureText) {
        return res.status(400).json({ error: 'Signature text is required' });
      }

      signature.status = 'signed';
      signature.signatureText = signatureText;
      signature.signedAt = new Date();
      signature.ipAddress = req.ip;
    } else {
      signature.status = 'rejected';
      signature.rejectedAt = new Date();
      signature.rejectionReason = req.body.reason || 'No reason provided';
      signature.ipAddress = req.ip;
    }

    await signature.save();

    res.json({
      message: `Document ${action}ed successfully`,
      signature: {
        id: signature._id,
        status: signature.status,
        signedAt: signature.signedAt,
        rejectedAt: signature.rejectedAt,
        rejectionReason: signature.rejectionReason,
      },
    });
  } catch (error) {
    console.error('Sign document error:', error);
    res.status(500).json({ error: 'Server error processing signature' });
  }
};

const finalizeDocument = async (req, res) => {
  try {
    const { documentId } = req.params;

    const document = await Document.findById(documentId);
    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }

    if (document.uploadedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const signatures = await Signature.find({ documentId, status: 'signed' });
    if (signatures.length === 0) {
      return res.status(400).json({ error: 'No signed signatures found' });
    }

    // Load the PDF
    const pdfBytes = fs.readFileSync(document.filePath);
    const pdfDoc = await PDFDocument.load(pdfBytes);
    
    // Add signatures to PDF
    for (const signature of signatures) {
      const pages = pdfDoc.getPages();
      const page = pages[signature.page - 1];
      
      if (page) {
        const { height } = page.getSize();
        
        // Convert coordinates (PDF coordinate system has origin at bottom-left)
        const pdfY = height - signature.y - signature.height;
        
        page.drawText(signature.signatureText, {
          x: signature.x,
          y: pdfY,
          size: 12,
          color: rgb(0, 0, 0),
        });
      }
    }

    // Save the signed PDF
    const signedPdfBytes = await pdfDoc.save();
    const signedFilePath = document.filePath.replace('.pdf', '_signed.pdf');
    fs.writeFileSync(signedFilePath, signedPdfBytes);

    // Update document status
    document.status = 'signed';
    await document.save();

    res.json({
      message: 'Document finalized successfully',
      signedDocument: {
        id: document._id,
        title: document.title,
        status: document.status,
        signedFilePath: signedFilePath,
      },
    });
  } catch (error) {
    console.error('Finalize document error:', error);
    res.status(500).json({ error: 'Server error finalizing document' });
  }
};

const getPublicSignature = async (req, res) => {
  try {
    const { token } = req.params;

    const signature = await Signature.findOne({ signatureToken: token })
      .populate('documentId', 'title originalName')
      .populate('userId', 'name email');

    if (!signature) {
      return res.status(404).json({ error: 'Invalid signature token' });
    }

    res.json({
      signature: {
        id: signature._id,
        document: signature.documentId,
        signerEmail: signature.signerEmail,
        signerName: signature.signerName,
        status: signature.status,
        createdAt: signature.createdAt,
      },
    });
  } catch (error) {
    console.error('Get public signature error:', error);
    res.status(500).json({ error: 'Server error fetching signature' });
  }
};

module.exports = {
  addSignature,
  getSignatures,
  signDocument,
  finalizeDocument,
  getPublicSignature,
};
