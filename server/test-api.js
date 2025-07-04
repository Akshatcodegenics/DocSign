const express = require('express');
const cors = require('cors');
const path = require('path');

// Mock database models
const mockDocument = {
  _id: '507f1f77bcf86cd799439011',
  title: 'Test Document',
  filename: 'test.pdf',
  originalName: 'original-test.pdf',
  filePath: './uploads/test.pdf',
  fileSize: 1024,
  mimeType: 'application/pdf',
  status: 'pending',
  createdAt: new Date(),
  uploadedBy: {
    _id: '507f1f77bcf86cd799439012',
    name: 'Test User',
    email: 'test@example.com'
  },
  save: async () => mockDocument
};

const mockSignature = {
  _id: '507f1f77bcf86cd799439013',
  documentId: '507f1f77bcf86cd799439011',
  userId: '507f1f77bcf86cd799439012',
  x: 100,
  y: 200,
  page: 1,
  width: 200,
  height: 60,
  signerEmail: 'signer@example.com',
  signerName: 'John Doe',
  signatureText: 'John Doe',
  status: 'signed',
  signedAt: new Date(),
  save: async () => mockSignature
};

// Mock models
const Document = {
  findById: async (id) => {
    if (id === '507f1f77bcf86cd799439011') {
      return {
        ...mockDocument,
        populate: () => ({ ...mockDocument })
      };
    }
    return null;
  }
};

const Signature = {
  countDocuments: async () => 0,
  prototype: function(data) {
    return { ...mockSignature, ...data };
  }
};

// Create test app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Mock auth middleware
const mockAuth = (req, res, next) => {
  req.user = { _id: '507f1f77bcf86cd799439012' };
  next();
};

// Mock upload middleware
const mockUpload = {
  single: (fieldName) => (req, res, next) => {
    req.file = {
      filename: 'test-upload.pdf',
      originalname: 'document.pdf',
      path: './uploads/test-upload.pdf',
      size: 2048,
      mimetype: 'application/pdf'
    };
    next();
  }
};

// Test endpoints
app.post('/api/upload', mockAuth, mockUpload.single('pdf'), async (req, res) => {
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

    const document = { ...mockDocument, title, ...req.file };

    res.status(201).json({
      success: true,
      message: 'Document uploaded successfully',
      data: {
        id: document._id,
        title: document.title,
        filename: document.filename,
        originalName: document.originalName,
        filePath: req.file.path,
        s3Key: req.file.path,
        fileSize: document.fileSize,
        status: document.status,
        createdAt: document.createdAt,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

app.get('/api/documents/:id', mockAuth, async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);

    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Document not found',
      });
    }

    const PORT = process.env.PORT || 9999;
    const signedUrl = `http://localhost:${PORT}/uploads/${document.filename}`;
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
        pages: 1,
        signatureCount,
        signedUrl,
        uploadedBy: {
          id: document.uploadedBy._id,
          name: document.uploadedBy.name,
          email: document.uploadedBy.email,
        },
        createdAt: document.createdAt,
        updatedAt: document.createdAt,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

app.post('/api/documents/:id/sign', mockAuth, async (req, res) => {
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

    const signature = {
      ...mockSignature,
      x: parseFloat(x),
      y: parseFloat(y),
      page: parseInt(page),
      width: width ? parseFloat(width) : 200,
      height: height ? parseFloat(height) : 60,
      signerEmail,
      signerName,
      signatureText: signatureText || signerName,
    };

    res.json({
      success: true,
      message: 'Signature applied successfully',
      data: {
        documentId: document._id,
        signatureId: signature._id,
        updatedFilePath: './uploads/test-signed.pdf',
        signedUrl: `http://localhost:${process.env.PORT || 9999}/uploads/test-signed.pdf`,
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
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error occurred:', err);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Internal server error',
  });
});

// Start test server
const PORT = process.env.PORT || 9999;
app.listen(PORT, () => {
  console.log(`Test API server running on port ${PORT}`);
  console.log('\nAvailable endpoints:');
  console.log(`POST http://localhost:${PORT}/api/upload`);
  console.log(`GET  http://localhost:${PORT}/api/documents/507f1f77bcf86cd799439011`);
  console.log(`POST http://localhost:${PORT}/api/documents/507f1f77bcf86cd799439011/sign`);
});
