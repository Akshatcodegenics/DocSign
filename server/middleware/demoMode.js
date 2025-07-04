// Demo mode middleware for when MongoDB is not available
const crypto = require('crypto');

// Mock data store (in-memory)
let mockDocuments = {};
let mockSignatures = {};
let mockUsers = {};

// Create default demo user
const demoUser = {
  _id: '60f7b3b3b3b3b3b3b3b3b3b3',
  name: 'Demo User',
  email: 'demo@example.com',
  password: 'hashedpassword'
};
mockUsers[demoUser._id] = demoUser;

// Create a demo document
const demoDocument = {
  _id: '60f7b3b3b3b3b3b3b3b3b3b4',
  title: 'Sample Contract',
  filename: 'sample-contract.pdf',
  originalName: 'contract.pdf',
  filePath: './uploads/sample-contract.pdf',
  fileSize: 1024000,
  mimeType: 'application/pdf',
  uploadedBy: demoUser._id,
  status: 'pending',
  pages: 3,
  createdAt: new Date(),
  updatedAt: new Date(),
  populate: function(field) {
    if (field === 'uploadedBy') {
      this.uploadedBy = demoUser;
    }
    return this;
  },
  save: async function() {
    mockDocuments[this._id] = this;
    return this;
  }
};
mockDocuments[demoDocument._id] = demoDocument;

// Create demo signatures
const demoSignature1 = {
  _id: '60f7b3b3b3b3b3b3b3b3b3b5',
  documentId: demoDocument._id,
  userId: demoUser._id,
  x: 100,
  y: 200,
  page: 1,
  width: 150,
  height: 40,
  signerEmail: 'demo@example.com',
  signerName: 'Demo User',
  signatureToken: 'demo-token-1',
  signatureText: 'Demo User Signature',
  status: 'signed',
  signedAt: new Date(),
  ipAddress: '127.0.0.1',
  createdAt: new Date('2024-01-01T10:00:00Z'),
  biometricData: { pressure: [0.5, 0.7, 0.9], speed: [10, 15, 20] },
  userAgent: 'Demo Browser',
  geolocation: { latitude: 40.7128, longitude: -74.0060 }
};

const demoSignature2 = {
  _id: '60f7b3b3b3b3b3b3b3b3b3b6',
  documentId: demoDocument._id,
  userId: 'another-user-id',
  x: 300,
  y: 400,
  page: 2,
  width: 150,
  height: 40,
  signerEmail: 'jane.doe@example.com',
  signerName: 'Jane Doe',
  signatureToken: 'demo-token-2',
  signatureText: 'Jane Doe',
  status: 'signed',
  signedAt: new Date(),
  ipAddress: '127.0.0.1',
  createdAt: new Date('2024-01-01T11:00:00Z'),
  biometricData: { pressure: [0.3, 0.6, 0.8], speed: [8, 12, 18] },
  userAgent: 'Demo Browser',
  geolocation: { latitude: 40.7580, longitude: -73.9855 }
};

mockSignatures[demoSignature1._id] = demoSignature1;
mockSignatures[demoSignature2._id] = demoSignature2;

// Mock Document model
const MockDocument = function(data) {
  const id = data._id || crypto.randomBytes(12).toString('hex');
  const doc = {
    _id: id,
    title: data.title,
    filename: data.filename,
    originalName: data.originalName,
    filePath: data.filePath,
    fileSize: data.fileSize,
    mimeType: data.mimeType,
    uploadedBy: data.uploadedBy,
    status: data.status || 'pending',
    pages: data.pages || 1,
    createdAt: new Date(),
    updatedAt: new Date(),
    populate: function(field) {
      if (field === 'uploadedBy' && this.uploadedBy) {
        this.uploadedBy = mockUsers[this.uploadedBy] || demoUser;
      }
      return this;
    },
    save: async function() {
      mockDocuments[this._id] = this;
      this.updatedAt = new Date();
      return this;
    }
  };
  return doc;
};

MockDocument.findById = async function(id) {
  const doc = mockDocuments[id];
  if (doc) {
    return {
      ...doc,
      populate: function(field) {
        if (field === 'uploadedBy' && this.uploadedBy) {
          this.uploadedBy = mockUsers[this.uploadedBy] || demoUser;
        }
        return this;
      }
    };
  }
  return null;
};

MockDocument.find = async function(query) {
  return Object.values(mockDocuments).filter(doc => {
    if (query.uploadedBy) {
      return doc.uploadedBy === query.uploadedBy;
    }
    return true;
  });
};

// Mock Signature model
const MockSignature = function(data) {
  const id = data._id || crypto.randomBytes(12).toString('hex');
  const sig = {
    _id: id,
    documentId: data.documentId,
    userId: data.userId,
    x: data.x,
    y: data.y,
    page: data.page,
    width: data.width,
    height: data.height,
    signerEmail: data.signerEmail,
    signerName: data.signerName,
    signatureToken: data.signatureToken,
    signatureText: data.signatureText,
    status: data.status || 'pending',
    signedAt: data.signedAt,
    ipAddress: data.ipAddress,
    createdAt: new Date(),
    save: async function() {
      mockSignatures[this._id] = this;
      return this;
    }
  };
  return sig;
};

MockSignature.countDocuments = async function(query) {
  return Object.values(mockSignatures).filter(sig => {
    if (query.documentId) {
      return sig.documentId === query.documentId;
    }
    return true;
  }).length;
};

MockSignature.find = function(query) {
  let results = Object.values(mockSignatures).filter(sig => {
    if (query.documentId) {
      return sig.documentId === query.documentId;
    }
    if (query.status) {
      return sig.status === query.status;
    }
    return true;
  });
  
  // Return a promise that resolves to the results directly
  return Promise.resolve(results);
};

// Demo mode middleware
const demoMode = (req, res, next) => {
  // Add demo user to request if no auth
  if (!req.user) {
    req.user = demoUser;
  }
  
  // Replace models with mock versions
  req.Document = MockDocument;
  req.Signature = MockSignature;
  
  // Add demo flag
  req.isDemoMode = true;
  
  next();
};

module.exports = {
  demoMode,
  MockDocument,
  MockSignature,
  demoUser,
  demoDocument
};
