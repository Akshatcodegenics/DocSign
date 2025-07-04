const Document = require('../models/Document');
const path = require('path');
const fs = require('fs');

const uploadDocument = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { title } = req.body;
    if (!title) {
      return res.status(400).json({ error: 'Document title is required' });
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
      message: 'Document uploaded successfully',
      document: {
        id: document._id,
        title: document.title,
        filename: document.filename,
        originalName: document.originalName,
        fileSize: document.fileSize,
        status: document.status,
        createdAt: document.createdAt,
      },
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Server error during upload' });
  }
};

const getDocuments = async (req, res) => {
  try {
    const documents = await Document.find({ uploadedBy: req.user._id })
      .sort({ createdAt: -1 })
      .select('-filePath');

    res.json({
      documents,
      count: documents.length,
    });
  } catch (error) {
    console.error('Get documents error:', error);
    res.status(500).json({ error: 'Server error fetching documents' });
  }
};

const getDocument = async (req, res) => {
  try {
    const document = await Document.findOne({
      _id: req.params.id,
      uploadedBy: req.user._id,
    });

    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }

    res.json(document);
  } catch (error) {
    console.error('Get document error:', error);
    res.status(500).json({ error: 'Server error fetching document' });
  }
};

const serveDocument = async (req, res) => {
  try {
    const document = await Document.findOne({
      _id: req.params.id,
      uploadedBy: req.user._id,
    });

    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }

    const filePath = path.resolve(document.filePath);
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'File not found on server' });
    }

    res.setHeader('Content-Type', document.mimeType);
    res.setHeader('Content-Disposition', `inline; filename="${document.originalName}"`);
    
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
  } catch (error) {
    console.error('Serve document error:', error);
    res.status(500).json({ error: 'Server error serving document' });
  }
};

const deleteDocument = async (req, res) => {
  try {
    const document = await Document.findOne({
      _id: req.params.id,
      uploadedBy: req.user._id,
    });

    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }

    // Delete file from filesystem
    if (fs.existsSync(document.filePath)) {
      fs.unlinkSync(document.filePath);
    }

    await Document.findByIdAndDelete(req.params.id);

    res.json({ message: 'Document deleted successfully' });
  } catch (error) {
    console.error('Delete document error:', error);
    res.status(500).json({ error: 'Server error deleting document' });
  }
};

module.exports = {
  uploadDocument,
  getDocuments,
  getDocument,
  serveDocument,
  deleteDocument,
};
