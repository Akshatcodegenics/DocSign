require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const http = require('http');
const socketIo = require('socket.io');

// Import routes
const authRoutes = require('./routes/auth');
const documentRoutes = require('./routes/documents');
const signatureRoutes = require('./routes/signatures');
const auditRoutes = require('./routes/audit');
const apiRoutes = require('./routes/api');
const exportRoutes = require('./routes/export');

const app = express();

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
  optionsSuccessStatus: 200
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api', apiRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/docs', documentRoutes);
app.use('/api/signatures', signatureRoutes);
app.use('/api/audit', auditRoutes);
app.use('/api/export', exportRoutes);

// Custom Error Handler (must be after routes)
const errorHandler = require('./middleware/errorHandler');
app.use(errorHandler);

// Database connection with fallback
let dbConnected = false;

if (process.env.NODE_ENV !== 'test') {
  mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/signflow', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
  })
  .then(() => {
    dbConnected = true;
    console.log('✅ Connected to MongoDB');
  })
  .catch((err) => {
    console.log('⚠️  MongoDB not available, running in demo mode');
    console.log('   Some features may be limited');
  });

  mongoose.connection.on('error', (err) => {
    console.log('MongoDB connection error:', err.message);
  });
} else {
  console.log('🧪 Running in test mode without database');
}

// Create HTTP server
const server = http.createServer(app);

// Setup Socket.IO
const io = socketIo(server, {
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// WebSocket connection handling
io.on('connection', (socket) => {
  console.log('🔌 User connected:', socket.id);
  
  // Handle authentication for WebSocket
  socket.on('authenticate', (token) => {
    // Add token validation here if needed
    console.log('🔐 Socket authentication for:', socket.id);
  });
  
  // Handle document collaboration
  socket.on('join-document', (documentId) => {
    socket.join(documentId);
    console.log(`📄 User ${socket.id} joined document ${documentId}`);
  });
  
  // Handle signature events
  socket.on('signature-added', (data) => {
    socket.to(data.documentId).emit('signature-update', data);
    console.log(`✏️  Signature added to document ${data.documentId}`);
  });
  
  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('🔌 User disconnected:', socket.id);
  });
});

// Start server
const PORT = process.env.PORT || 9999;
server.listen(PORT, () => {
  console.log(`\n🚀 Server running on port ${PORT}`);
  console.log(`\n📋 Available API Endpoints:`);
  console.log(`   POST http://localhost:${PORT}/api/upload`);
  console.log(`   GET  http://localhost:${PORT}/api/documents/:id`);
  console.log(`   POST http://localhost:${PORT}/api/documents/:id/sign`);
  console.log(`\n🌐 Demo Document ID: 60f7b3b3b3b3b3b3b3b3b3b4`);
  console.log(`\n📁 Static files served from: http://localhost:${PORT}/uploads/`);
  console.log(`\n🔌 WebSocket server ready`);
});
