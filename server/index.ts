import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import path from 'path';

// Import routes
const authRoutes = require('./routes/auth');
const documentRoutes = require('./routes/documents');
const signatureRoutes = require('./routes/signatures');
import apiRoutes from './routes/api';
const auditRoutes = require('./routes/audit');

const app = express();

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
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

// Custom Error Handler (must be after routes)
import errorHandler from './middleware/errorHandler';
app.use(errorHandler);

// Database connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/signflow');

mongoose.connection.on('connected', () => {
  console.log('Connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
