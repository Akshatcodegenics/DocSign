import axios from 'axios';

// Configure axios defaults
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:9999';

const exportAPI = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds for file downloads
});

// Add authentication token to requests
exportAPI.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      // For demo purposes, try to get a demo token if no user token exists
      console.warn('No authentication token found. Export may fail without login.');
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for better error handling
exportAPI.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.error('Authentication failed. Please log in to use export features.');
      error.message = 'Authentication required. Please log in to export documents.';
    } else if (error.response?.status === 403) {
      error.message = 'Access denied. You don\'t have permission to export this document.';
    } else if (error.response?.status === 404) {
      error.message = 'Document not found. The document may have been deleted or you may not have access.';
    } else if (error.response?.status >= 500) {
      error.message = 'Server error occurred. Please try again later.';
    }
    return Promise.reject(error);
  }
);

// Direct API call function with proper error handling
const apiCall = async (url: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('token');
  
  const defaultHeaders = {
    'Authorization': token ? `Bearer ${token}` : '',
    'Content-Type': 'application/json',
    ...options.headers
  };

  const response = await fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers: defaultHeaders
  });

  if (!response.ok) {
    const errorText = await response.text();
    let errorMessage;
    try {
      const errorData = JSON.parse(errorText);
      errorMessage = errorData.error || errorData.message || 'Export failed';
    } catch {
      errorMessage = `HTTP ${response.status}: ${response.statusText}`;
    }
    throw new Error(errorMessage);
  }

  return response;
};

// Export service methods with direct fetch calls
export const exportService = {
  // Get available export formats
  getExportFormats: async () => {
    const response = await apiCall('/api/export/formats');
    return await response.json();
  },

  // Export document as PDF
  exportAsPDF: async (documentId: string) => {
    const response = await apiCall(`/api/export/${documentId}/pdf`);
    const blob = await response.blob();
    return { data: blob };
  },

  // Export document as image
  exportAsImage: async (documentId: string, format: 'png' | 'jpeg' | 'webp', quality = 95) => {
    const response = await apiCall(`/api/export/${documentId}/image/${format}?quality=${quality}`);
    const blob = await response.blob();
    return { data: blob };
  },

  // Export signature data as JSON
  exportAsJSON: async (documentId: string) => {
    const response = await apiCall(`/api/export/${documentId}/json`);
    return await response.json();
  },

  // Export audit trail
  exportAuditTrail: async (documentId: string, format: 'json' | 'csv' = 'json') => {
    if (format === 'csv') {
      const response = await apiCall(`/api/export/${documentId}/audit?format=csv`);
      const blob = await response.blob();
      return { data: blob };
    } else {
      const response = await apiCall(`/api/export/${documentId}/audit?format=json`);
      return await response.json();
    }
  },

  // Export blockchain audit trail
  exportBlockchainAudit: async (documentId: string, format: 'json' | 'csv' = 'json') => {
    if (format === 'csv') {
      const response = await apiCall(`/api/export/${documentId}/blockchain?format=csv`);
      const blob = await response.blob();
      return { data: blob };
    } else {
      const response = await apiCall(`/api/export/${documentId}/blockchain?format=json`);
      return await response.json();
    }
  },

  // Helper method to download file from blob response
  downloadFile: (blob: Blob, filename: string, mimeType: string) => {
    const url = window.URL.createObjectURL(new Blob([blob], { type: mimeType }));
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  },

  // Generate filename with timestamp
  generateFilename: (documentName: string, format: string, suffix = '') => {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const baseName = documentName.replace(/\.[^/.]+$/, ""); // Remove extension
    const extension = format === 'audit_csv' ? 'csv' : 
                      format === 'blockchain_csv' ? 'csv' :
                      format === 'audit_json' || format === 'blockchain_json' || format === 'json' ? 'json' :
                      format === 'pdf' ? 'pdf' :
                      format === 'png' ? 'png' :
                      format === 'jpeg' ? 'jpg' : 'webp';
    
    return `${baseName}${suffix ? '-' + suffix : ''}-${timestamp}.${extension}`;
  }
};

export default exportService;
