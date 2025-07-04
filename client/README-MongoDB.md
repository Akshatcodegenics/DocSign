# MongoDB Integration Guide

This application has been updated to use MongoDB instead of Supabase for data storage. Below is the complete guide for setting up and using the MongoDB integration.

## 🗄️ MongoDB Integration Overview

The application now uses a custom MongoDB service layer that provides comprehensive functionality for:

- **Signature Management**: Save, retrieve, update, and delete signature data
- **Biometric Data Storage**: Store biometric signature capture data
- **Blockchain Audit Trail**: Immutable transaction logs with verification
- **Document Management**: Upload and manage PDF documents
- **AI Recommendations**: Store and retrieve AI-generated placement suggestions
- **User Management**: Handle user profiles and authentication
- **Analytics & Reporting**: Generate signature analytics and fraud detection reports
- **Legal Compliance**: Store compliance records and audit trails

## 🚀 Quick Setup

### 1. Environment Configuration

Copy the example environment file and configure your MongoDB settings:

```bash
cp .env.example .env
```

Update the `.env` file with your MongoDB configuration:

```env
# MongoDB API Configuration
REACT_APP_API_URL=http://localhost:5000

# Optional: MongoDB Database Configuration
REACT_APP_MONGODB_URI=mongodb://localhost:27017/signature-app

# Environment
REACT_APP_ENVIRONMENT=development

# App Configuration
REACT_APP_NAME=SignFlow
REACT_APP_VERSION=1.0.0

# Optional: JWT Secret for Authentication
REACT_APP_JWT_SECRET=your-secret-key-here

# Optional: AI and Blockchain API Keys
REACT_APP_AI_API_KEY=your-ai-api-key
REACT_APP_BLOCKCHAIN_API_KEY=your-blockchain-api-key
```

### 2. MongoDB Service Features

The `mongodbService.ts` provides the following APIs:

#### Signature Management
```typescript
// Save a signature
await mongodbService.saveSignature(signatureData);

// Get all signatures
const signatures = await mongodbService.getSignatures();

// Get signatures by user
const userSignatures = await mongodbService.getSignatures(userId);

// Get signature by ID
const signature = await mongodbService.getSignatureById(id);

// Update signature
await mongodbService.updateSignature(id, updates);

// Delete signature
await mongodbService.deleteSignature(id);
```

#### Biometric Data Management
```typescript
// Save biometric data
await mongodbService.saveBiometricData(biometricData);

// Get biometric data
const biometricData = await mongodbService.getBiometricData(userId);
```

#### Blockchain Audit Trail
```typescript
// Save blockchain entry
await mongodbService.saveBlockchainEntry(blockchainEntry);

// Get blockchain entries
const entries = await mongodbService.getBlockchainEntries(documentId);

// Verify blockchain integrity
const isValid = await mongodbService.verifyBlockchainIntegrity(entries);
```

#### Document Management
```typescript
// Upload document
await mongodbService.uploadDocument(file, metadata);

// Get documents
const documents = await mongodbService.getDocuments(userId);

// Get document by ID
const document = await mongodbService.getDocumentById(id);
```

#### AI Recommendations
```typescript
// Save AI recommendations
await mongodbService.saveAIRecommendations(recommendations);

// Get AI recommendations
const recommendations = await mongodbService.getAIRecommendations(documentId);
```

#### Analytics & Reporting
```typescript
// Get signature analytics
const analytics = await mongodbService.getSignatureAnalytics(userId);

// Get fraud detection report
const fraudReport = await mongodbService.getFraudDetectionReport(timeframe);
```

## 🛠️ Backend API Requirements

Your MongoDB backend should implement the following REST API endpoints:

### Signature Endpoints
- `POST /api/signatures` - Create signature
- `GET /api/signatures` - Get all signatures
- `GET /api/signatures/:id` - Get signature by ID
- `PUT /api/signatures/:id` - Update signature
- `DELETE /api/signatures/:id` - Delete signature

### Biometric Data Endpoints
- `POST /api/biometric-data` - Save biometric data
- `GET /api/biometric-data` - Get biometric data

### Blockchain Endpoints
- `POST /api/blockchain-entries` - Save blockchain entry
- `GET /api/blockchain-entries` - Get blockchain entries
- `POST /api/blockchain-entries/verify` - Verify blockchain integrity

### Document Endpoints
- `POST /api/documents/upload` - Upload document
- `GET /api/documents` - Get documents
- `GET /api/documents/:id` - Get document by ID

### AI Recommendations Endpoints
- `POST /api/ai-recommendations` - Save AI recommendations
- `GET /api/ai-recommendations/:documentId` - Get AI recommendations

### User Management Endpoints
- `POST /api/users` - Create user
- `GET /api/users/:id` - Get user profile
- `PUT /api/users/:id` - Update user profile

### Analytics Endpoints
- `GET /api/analytics/signatures` - Get signature analytics
- `GET /api/analytics/fraud-detection` - Get fraud detection report

### Audit Trail Endpoints
- `POST /api/audit-trail` - Save audit entry
- `GET /api/audit-trail` - Get audit trail

### Compliance Endpoints
- `POST /api/compliance` - Save compliance record
- `GET /api/compliance` - Get compliance records

## 📊 Data Models

### Signature Data Model
```typescript
interface SignatureData {
  name: string;
  font: string;
  fontSize: number;
  position: { x: number; y: number };
  page: number;
  locked: boolean;
  timestamp: string;
  userId?: string;
  biometricData?: BiometricData;
  voiceData?: string;
  auditTrail?: AuditEntry[];
}
```

### Biometric Data Model
```typescript
interface BiometricCanvasData {
  imageData: string;
  strokes: StrokeData[];
  metadata: {
    duration: number;
    totalPoints: number;
    averagePressure: number;
    averageSpeed: number;
    deviceType: string;
  };
}
```

### Blockchain Entry Model
```typescript
interface BlockchainEntry {
  id: string;
  blockHash: string;
  previousHash: string;
  timestamp: number;
  action: string;
  userId: string;
  documentHash: string;
  signatureHash: string;
  ipAddress: string;
  geolocation?: { lat: number; lng: number };
  merkleRoot: string;
  nonce: number;
  verified: boolean;
}
```

## 🔧 Usage in Components

The MongoDB service is already integrated into the main `SignatureComponent`. When a user saves a signature, it automatically calls:

```typescript
try {
  await mongodbService.saveSignature(signature);
  addAuditEntry('Signature saved to MongoDB');
} catch (error) {
  console.error('Error saving to MongoDB:', error);
}
```

## 🚀 Getting Started

1. **Install dependencies**: `npm install`
2. **Configure environment**: Update `.env` with your MongoDB API URL
3. **Start the application**: `npm start`
4. **Ensure your MongoDB backend is running**: The backend should be accessible at the configured API URL

## 🔐 Security Considerations

- All API calls are made through HTTPS in production
- Biometric data is encrypted before storage
- Blockchain entries provide immutable audit trails
- User authentication is handled via JWT tokens
- Input validation and sanitization on all endpoints

## 📱 Features Enabled by MongoDB Integration

✅ **Real-time signature storage**
✅ **Biometric data capture and analysis**
✅ **Blockchain audit trail verification**
✅ **Document version control**
✅ **AI recommendation persistence**
✅ **Fraud detection analytics**
✅ **Legal compliance tracking**
✅ **User profile management**
✅ **Multi-party collaboration**
✅ **Advanced reporting and analytics**

## 🆘 Troubleshooting

### Common Issues:

1. **Connection refused**: Ensure your MongoDB backend is running on the specified port
2. **CORS errors**: Configure your backend to allow requests from your React app domain
3. **Authentication errors**: Verify JWT token configuration
4. **Data not saving**: Check network tab for API response errors

### Debug Mode:
Enable debug mode in your `.env` file:
```env
REACT_APP_DEBUG=true
```

This will provide detailed console logging for all MongoDB service calls.

---

The application is now fully configured to use MongoDB for all data storage needs, providing enterprise-grade functionality with advanced features like blockchain verification, biometric analysis, and AI-powered recommendations.
