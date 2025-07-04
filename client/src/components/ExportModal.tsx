import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Download, 
  FileText, 
  Image, 
  Database, 
  FileSpreadsheet,
  X,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import exportService from '../services/exportService';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentId: string;
  documentName: string;
}

interface ExportFormat {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  endpoint: string;
  mimeType: string;
  color: string;
}

const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose, documentId, documentName }) => {
  const [isExporting, setIsExporting] = useState(false);
  const [exportStatus, setExportStatus] = useState<{type: 'success' | 'error', message: string} | null>(null);

  const exportFormats: ExportFormat[] = [
    {
      id: 'pdf',
      name: 'PDF Document',
      description: 'Export the signed document as a PDF file',
      icon: FileText,
      endpoint: `/api/export/${documentId}/pdf`,
      mimeType: 'application/pdf',
      color: 'red'
    },
    {
      id: 'png',
      name: 'PNG Image',
      description: 'Export document as high-quality PNG image',
      icon: Image,
      endpoint: `/api/export/${documentId}/image/png`,
      mimeType: 'image/png',
      color: 'blue'
    },
    {
      id: 'jpeg',
      name: 'JPEG Image',
      description: 'Export document as compressed JPEG image',
      icon: Image,
      endpoint: `/api/export/${documentId}/image/jpeg`,
      mimeType: 'image/jpeg',
      color: 'green'
    },
    {
      id: 'webp',
      name: 'WebP Image',
      description: 'Export document as modern WebP image format',
      icon: Image,
      endpoint: `/api/export/${documentId}/image/webp`,
      mimeType: 'image/webp',
      color: 'purple'
    },
    {
      id: 'json',
      name: 'JSON Data',
      description: 'Export signature data and metadata as JSON',
      icon: Database,
      endpoint: `/api/export/${documentId}/json`,
      mimeType: 'application/json',
      color: 'indigo'
    },
    {
      id: 'audit_csv',
      name: 'Audit Trail (CSV)',
      description: 'Export audit trail as CSV for spreadsheet import',
      icon: FileSpreadsheet,
      endpoint: `/api/export/${documentId}/audit?format=csv`,
      mimeType: 'text/csv',
      color: 'orange'
    },
    {
      id: 'audit_json',
      name: 'Audit Trail (JSON)',
      description: 'Export complete audit trail as JSON',
      icon: Database,
      endpoint: `/api/export/${documentId}/audit?format=json`,
      mimeType: 'application/json',
      color: 'teal'
    },
    {
      id: 'blockchain_json',
      name: 'Blockchain Audit (JSON)',
      description: 'Export blockchain audit trail with cryptographic verification',
      icon: Database,
      endpoint: `/api/export/${documentId}/blockchain?format=json`,
      mimeType: 'application/json',
      color: 'violet'
    },
    {
      id: 'blockchain_csv',
      name: 'Blockchain Audit (CSV)',
      description: 'Export blockchain audit trail as CSV with verification data',
      icon: FileSpreadsheet,
      endpoint: `/api/export/${documentId}/blockchain?format=csv`,
      mimeType: 'text/csv',
      color: 'rose'
    }
  ];

  // Bulletproof authentication function
  const ensureAuthentication = async () => {
    let token = localStorage.getItem('token');
    
    // If no token, try to get demo token
    if (!token) {
      console.log('No token found, attempting demo login...');
      try {
        const response = await fetch('http://localhost:9999/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: 'demo@example.com',
            password: 'demo123'
          })
        });
        
        if (response.ok) {
          const data = await response.json();
          localStorage.setItem('token', data.token);
          token = data.token;
          console.log('Demo authentication successful for export');
        } else {
          console.error('Demo login failed:', await response.text());
          return null;
        }
      } catch (error) {
        console.error('Demo authentication failed:', error);
        return null;
      }
    }
    
    // Verify token is valid
    try {
      const testResponse = await fetch('http://localhost:9999/api/export/formats', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (testResponse.ok) {
        return token;
      } else {
        console.error('Token validation failed:', await testResponse.text());
        localStorage.removeItem('token');
        return null;
      }
    } catch (error) {
      console.error('Token validation error:', error);
      return null;
    }
  };

  const handleExport = async (format: ExportFormat) => {
    setIsExporting(true);
    setExportStatus(null);
    
    // Ensure authentication before export
    const isAuthenticated = await ensureAuthentication();
    if (!isAuthenticated) {
      setExportStatus({
        type: 'error',
        message: 'Authentication failed. Please log in to export documents.'
      });
      setIsExporting(false);
      return;
    }

    try {
      let response;
      let filename;

      // Use the appropriate export service method based on format
      switch (format.id) {
        case 'pdf':
          response = await exportService.exportAsPDF(documentId);
          filename = exportService.generateFilename(documentName, format.id);
          exportService.downloadFile(response.data, filename, format.mimeType);
          break;
          
        case 'png':
        case 'jpeg':
        case 'webp':
          response = await exportService.exportAsImage(documentId, format.id as 'png' | 'jpeg' | 'webp');
          filename = exportService.generateFilename(documentName, format.id);
          exportService.downloadFile(response.data, filename, format.mimeType);
          break;
          
        case 'json':
          const jsonData = await exportService.exportAsJSON(documentId);
          filename = exportService.generateFilename(documentName, format.id);
          const jsonBlob = new Blob([JSON.stringify(jsonData, null, 2)], { type: format.mimeType });
          exportService.downloadFile(jsonBlob, filename, format.mimeType);
          break;
          
        case 'audit_csv':
          response = await exportService.exportAuditTrail(documentId, 'csv');
          filename = exportService.generateFilename(documentName, format.id);
          exportService.downloadFile(response.data, filename, format.mimeType);
          break;
          
        case 'audit_json':
          const auditData = await exportService.exportAuditTrail(documentId, 'json');
          filename = exportService.generateFilename(documentName, format.id);
          const auditBlob = new Blob([JSON.stringify(auditData, null, 2)], { type: format.mimeType });
          exportService.downloadFile(auditBlob, filename, format.mimeType);
          break;
          
        case 'blockchain_json':
          const blockchainData = await exportService.exportBlockchainAudit(documentId, 'json');
          filename = exportService.generateFilename(documentName, format.id);
          const blockchainBlob = new Blob([JSON.stringify(blockchainData, null, 2)], { type: format.mimeType });
          exportService.downloadFile(blockchainBlob, filename, format.mimeType);
          break;
          
        case 'blockchain_csv':
          response = await exportService.exportBlockchainAudit(documentId, 'csv');
          filename = exportService.generateFilename(documentName, format.id);
          exportService.downloadFile(response.data, filename, format.mimeType);
          break;
          
        default:
          throw new Error(`Unsupported export format: ${format.id}`);
      }

      setExportStatus({
        type: 'success',
        message: `${format.name} exported successfully!`
      });

      // Auto-close success message after 3 seconds
      setTimeout(() => {
        setExportStatus(null);
      }, 3000);

    } catch (error: any) {
      console.error('Export error:', error);
      setExportStatus({
        type: 'error',
        message: error.response?.data?.error || `Failed to export ${format.name}. Please try again.`
      });
    } finally {
      setIsExporting(false);
    }
  };

  const getColorClasses = (color: string) => {
    const colorMap: Record<string, string> = {
      red: 'bg-red-50 border-red-200 hover:bg-red-100',
      blue: 'bg-blue-50 border-blue-200 hover:bg-blue-100',
      green: 'bg-green-50 border-green-200 hover:bg-green-100',
      purple: 'bg-purple-50 border-purple-200 hover:bg-purple-100',
      indigo: 'bg-indigo-50 border-indigo-200 hover:bg-indigo-100',
      orange: 'bg-orange-50 border-orange-200 hover:bg-orange-100',
      teal: 'bg-teal-50 border-teal-200 hover:bg-teal-100',
      violet: 'bg-violet-50 border-violet-200 hover:bg-violet-100',
      rose: 'bg-rose-50 border-rose-200 hover:bg-rose-100'
    };
    return colorMap[color] || 'bg-gray-50 border-gray-200 hover:bg-gray-100';
  };

  const getIconColor = (color: string) => {
    const colorMap: Record<string, string> = {
      red: 'text-red-600',
      blue: 'text-blue-600',
      green: 'text-green-600',
      purple: 'text-purple-600',
      indigo: 'text-indigo-600',
      orange: 'text-orange-600',
      teal: 'text-teal-600',
      violet: 'text-violet-600',
      rose: 'text-rose-600'
    };
    return colorMap[color] || 'text-gray-600';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.3 }}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Export Document</h2>
              <p className="text-blue-100 mt-1">{documentName}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Status Messages */}
        {exportStatus && (
          <motion.div
            className={`mx-6 mt-6 p-4 rounded-lg border ${
              exportStatus.type === 'success' 
                ? 'bg-green-50 border-green-200 text-green-800' 
                : 'bg-red-50 border-red-200 text-red-800'
            }`}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center space-x-2">
              {exportStatus.type === 'success' ? (
                <CheckCircle className="w-5 h-5" />
              ) : (
                <AlertCircle className="w-5 h-5" />
              )}
              <span className="font-medium">{exportStatus.message}</span>
            </div>
          </motion.div>
        )}

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          <p className="text-gray-600 mb-6">
            Choose your preferred export format. The document will be downloaded with all signatures included.
          </p>

          {/* Export Formats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {exportFormats.map((format, index) => (
              <motion.button
                key={format.id}
                onClick={() => handleExport(format)}
                disabled={isExporting}
                className={`p-4 border-2 rounded-xl text-left transition-all duration-300 ${getColorClasses(format.color)} ${
                  isExporting ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-lg cursor-pointer'
                }`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 * index }}
                whileHover={!isExporting ? { scale: 1.02 } : {}}
                whileTap={!isExporting ? { scale: 0.98 } : {}}
              >
                <div className="flex items-start space-x-3">
                  <div className={`p-2 rounded-lg ${getColorClasses(format.color)}`}>
                    <format.icon className={`w-6 h-6 ${getIconColor(format.color)}`} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800 mb-1">{format.name}</h3>
                    <p className="text-sm text-gray-600">{format.description}</p>
                  </div>
                  <Download className={`w-5 h-5 ${getIconColor(format.color)} mt-1`} />
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 border-t">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">
              {isExporting ? 'Preparing download...' : 'Select a format to download your document'}
            </p>
            <button
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ExportModal;
