import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

interface SignatureData {
  name: string;
  font: string;
  fontSize: number;
  position: { x: number; y: number };
  page: number;
  locked: boolean;
  timestamp: string;
  userId?: string;
  biometricData?: any;
  voiceData?: string;
  auditTrail?: any[];
}

interface BiometricCanvasData {
  imageData: string;
  strokes: any[];
  metadata: {
    duration: number;
    totalPoints: number;
    averagePressure: number;
    averageSpeed: number;
    deviceType: string;
  };
}

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

class MongoDBService {
  // Signature Management
  async saveSignature(signature: SignatureData): Promise<any> {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/signatures`, signature);
      return response.data;
    } catch (error) {
      console.error('Error saving signature to MongoDB:', error);
      throw error;
    }
  }

  async getSignatures(userId?: string): Promise<SignatureData[]> {
    try {
      const url = userId 
        ? `${API_BASE_URL}/api/signatures?userId=${userId}`
        : `${API_BASE_URL}/api/signatures`;
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching signatures from MongoDB:', error);
      throw error;
    }
  }

  async getSignatureById(id: string): Promise<SignatureData> {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/signatures/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching signature by ID from MongoDB:', error);
      throw error;
    }
  }

  async updateSignature(id: string, signature: Partial<SignatureData>): Promise<any> {
    try {
      const response = await axios.put(`${API_BASE_URL}/api/signatures/${id}`, signature);
      return response.data;
    } catch (error) {
      console.error('Error updating signature in MongoDB:', error);
      throw error;
    }
  }

  async deleteSignature(id: string): Promise<any> {
    try {
      const response = await axios.delete(`${API_BASE_URL}/api/signatures/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting signature from MongoDB:', error);
      throw error;
    }
  }

  // Biometric Data Management
  async saveBiometricData(data: BiometricCanvasData): Promise<any> {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/biometric-data`, data);
      return response.data;
    } catch (error) {
      console.error('Error saving biometric data to MongoDB:', error);
      throw error;
    }
  }

  async getBiometricData(userId?: string): Promise<BiometricCanvasData[]> {
    try {
      const url = userId 
        ? `${API_BASE_URL}/api/biometric-data?userId=${userId}`
        : `${API_BASE_URL}/api/biometric-data`;
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching biometric data from MongoDB:', error);
      throw error;
    }
  }

  // Blockchain Audit Trail Management
  async saveBlockchainEntry(entry: BlockchainEntry): Promise<any> {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/blockchain-entries`, entry);
      return response.data;
    } catch (error) {
      console.error('Error saving blockchain entry to MongoDB:', error);
      throw error;
    }
  }

  async getBlockchainEntries(documentId?: string): Promise<BlockchainEntry[]> {
    try {
      const url = documentId 
        ? `${API_BASE_URL}/api/blockchain-entries?documentId=${documentId}`
        : `${API_BASE_URL}/api/blockchain-entries`;
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching blockchain entries from MongoDB:', error);
      throw error;
    }
  }

  async verifyBlockchainIntegrity(entries: BlockchainEntry[]): Promise<boolean> {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/blockchain-entries/verify`, { entries });
      return response.data.isValid;
    } catch (error) {
      console.error('Error verifying blockchain integrity:', error);
      throw error;
    }
  }

  // Document Management
  async uploadDocument(file: File, metadata?: any): Promise<any> {
    try {
      const formData = new FormData();
      formData.append('document', file);
      if (metadata) {
        formData.append('metadata', JSON.stringify(metadata));
      }

      const response = await axios.post(`${API_BASE_URL}/api/documents/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error uploading document to MongoDB:', error);
      throw error;
    }
  }

  async getDocuments(userId?: string): Promise<any[]> {
    try {
      const url = userId 
        ? `${API_BASE_URL}/api/documents?userId=${userId}`
        : `${API_BASE_URL}/api/documents`;
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching documents from MongoDB:', error);
      throw error;
    }
  }

  async getDocumentById(id: string): Promise<any> {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/documents/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching document by ID from MongoDB:', error);
      throw error;
    }
  }

  // AI Recommendations Management
  async saveAIRecommendations(recommendations: any[]): Promise<any> {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/ai-recommendations`, { recommendations });
      return response.data;
    } catch (error) {
      console.error('Error saving AI recommendations to MongoDB:', error);
      throw error;
    }
  }

  async getAIRecommendations(documentId: string): Promise<any[]> {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/ai-recommendations/${documentId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching AI recommendations from MongoDB:', error);
      throw error;
    }
  }

  // Analytics and Reporting
  async getSignatureAnalytics(userId?: string): Promise<any> {
    try {
      const url = userId 
        ? `${API_BASE_URL}/api/analytics/signatures?userId=${userId}`
        : `${API_BASE_URL}/api/analytics/signatures`;
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching signature analytics from MongoDB:', error);
      throw error;
    }
  }

  async getFraudDetectionReport(timeframe?: string): Promise<any> {
    try {
      const url = timeframe 
        ? `${API_BASE_URL}/api/analytics/fraud-detection?timeframe=${timeframe}`
        : `${API_BASE_URL}/api/analytics/fraud-detection`;
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching fraud detection report from MongoDB:', error);
      throw error;
    }
  }

  // User Management
  async createUser(userData: any): Promise<any> {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/users`, userData);
      return response.data;
    } catch (error) {
      console.error('Error creating user in MongoDB:', error);
      throw error;
    }
  }

  async getUserProfile(userId: string): Promise<any> {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/users/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user profile from MongoDB:', error);
      throw error;
    }
  }

  async updateUserProfile(userId: string, updates: any): Promise<any> {
    try {
      const response = await axios.put(`${API_BASE_URL}/api/users/${userId}`, updates);
      return response.data;
    } catch (error) {
      console.error('Error updating user profile in MongoDB:', error);
      throw error;
    }
  }

  // Audit Trail Management
  async saveAuditEntry(entry: any): Promise<any> {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/audit-trail`, entry);
      return response.data;
    } catch (error) {
      console.error('Error saving audit entry to MongoDB:', error);
      throw error;
    }
  }

  async getAuditTrail(userId?: string, documentId?: string): Promise<any[]> {
    try {
      const params = new URLSearchParams();
      if (userId) params.append('userId', userId);
      if (documentId) params.append('documentId', documentId);
      
      const response = await axios.get(`${API_BASE_URL}/api/audit-trail?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching audit trail from MongoDB:', error);
      throw error;
    }
  }

  // Legal Compliance
  async saveComplianceRecord(record: any): Promise<any> {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/compliance`, record);
      return response.data;
    } catch (error) {
      console.error('Error saving compliance record to MongoDB:', error);
      throw error;
    }
  }

  async getComplianceRecords(documentId?: string): Promise<any[]> {
    try {
      const url = documentId 
        ? `${API_BASE_URL}/api/compliance?documentId=${documentId}`
        : `${API_BASE_URL}/api/compliance`;
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching compliance records from MongoDB:', error);
      throw error;
    }
  }
}

export default new MongoDBService();
