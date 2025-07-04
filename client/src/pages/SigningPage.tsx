import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  FileText, 
  Save, 
  Share2, 
  Download,
  AlertCircle,
  CheckCircle,
  Sparkles,
  FileDown
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import EnhancedSignatureComponent from '../components/EnhancedSignatureComponent';
import ExportModal from '../components/ExportModal';

interface Document {
  id: string;
  name: string;
  status: 'pending' | 'signed' | 'rejected';
  createdAt: string;
  size: number;
  signers?: string[];
  fileUrl?: string;
}

const SigningPage: React.FC = () => {
  const { documentId } = useParams<{ documentId: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [document, setDocument] = useState<Document | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [signatureData, setSignatureData] = useState<any>(null);
  const [showSignature, setShowSignature] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  // Load document data
  useEffect(() => {
    const loadDocument = async () => {
      if (!documentId) {
        navigate('/dashboard');
        return;
      }

      try {
        // TODO: Replace with actual API call
        // For now, using mock data - in real app, fetch from backend
        const mockDocument: Document = {
          id: documentId,
          name: `Document_${documentId}.pdf`,
          status: 'pending',
          createdAt: new Date().toISOString(),
          size: 2048576,
          signers: [user?.email || 'user@example.com'],
          fileUrl: `/api/documents/${documentId}/file` // This would be the actual PDF URL
        };

        setDocument(mockDocument);
      } catch (error) {
        console.error('Error loading document:', error);
        navigate('/dashboard');
      } finally {
        setIsLoading(false);
      }
    };

    loadDocument();
  }, [documentId, navigate, user]);

  const handleSignatureComplete = (data: any) => {
    setSignatureData(data);
    console.log('Signature completed:', data);
  };
  const handleSaveSignature = async () => {
    if (!signatureData || !document) return;

    setIsSaving(true);
    try {
      // TODO: Replace with actual API call to save signature
      // const response = await fetch(`/api/documents/${document.id}/sign`, {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${token}`
      //   },
      //   body: JSON.stringify(signatureData)
      // });

      // Simulate saving to localStorage
      const documentKey = `file_${document.id}`;
      const signedDocsKey = `signedDocs_${user?.id}`;
      const signedDocs = JSON.parse(localStorage.getItem(signedDocsKey) || '[]');
      signedDocs.push(document);
      localStorage.setItem(signedDocsKey, JSON.stringify(signedDocs));

      // Update document status
      setDocument(prev => prev ? { ...prev, status: 'signed', fileUrl: documentKey } : null);
      alert('Document signed successfully!');

    } catch (error) {
      console.error('Error saving signature:', error);
      alert('Error saving signature. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleDownload = () => {
    const documentKey = `file_${document?.id}`;
    const fileData = localStorage.getItem(documentKey);
    if (fileData && document) {
      const link = window.document.createElement('a');
      link.href = fileData;
      link.download = document.name || 'document.pdf';
      link.click();
    }
  };
  
  const handleDelete = () => {
    const storedDocuments = JSON.parse(localStorage.getItem(`documents_${user?.id}`) || '[]');
    const updatedDocuments = storedDocuments.filter((doc: Document) => doc.id !== document?.id);
    localStorage.setItem(`documents_${user?.id}`, JSON.stringify(updatedDocuments));
    alert('Document deleted successfully!');
    navigate('/dashboard');
  };

  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };

  if (!isAuthenticated || !user) {
    return <div>Loading...</div>;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-secondary-50 to-accent-50 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          <p className="text-gray-600">Loading document...</p>
        </div>
      </div>
    );
  }

  if (!document) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-secondary-50 to-accent-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Document Not Found</h2>
          <p className="text-gray-600 mb-6">The document you're looking for doesn't exist or has been removed.</p>
          <button
            onClick={handleBackToDashboard}
            className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-secondary-50 to-accent-50 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-10 -left-10 w-72 h-72 bg-gradient-to-r from-primary-200 to-secondary-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float"></div>
        <div className="absolute top-40 -right-10 w-72 h-72 bg-gradient-to-r from-accent-200 to-primary-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Header */}
      <motion.header 
        className="relative z-10 bg-gradient-to-r from-primary-600 via-primary-700 to-secondary-600 text-white py-4 shadow-xl"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleBackToDashboard}
                className="p-2 bg-white/20 rounded-full backdrop-blur-sm hover:bg-white/30 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-white/20 rounded-full backdrop-blur-sm">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div>
                  <h1 className="text-xl font-bold">Sign Document</h1>
                  <p className="text-sm text-blue-100">{document.name}</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                {document.status === 'signed' ? (
                  <CheckCircle className="w-5 h-5 text-green-300" />
                ) : (
                  <FileText className="w-5 h-5 text-yellow-300" />
                )}
                <span className="text-sm font-medium">
                  {document.status === 'signed' ? 'Signed' : 'Pending Signature'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="relative z-10 container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Enhanced Signature Platform - Full Width */}
          <motion.div 
            className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >

            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Enhanced Signature Platform</h2>
              {document.status === 'signed' && (
                <CheckCircle className="w-6 h-6 text-green-500" />
              )}
            </div>

              {/* Show/Hide Signature Component */}
              {!showSignature && document.status !== 'signed' && (
                <div className="text-center">
                  <p className="text-gray-600 mb-4">
                    Ready to sign this document with advanced signature features?
                  </p>
                  <button
                    onClick={() => setShowSignature(true)}
                    className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white px-6 py-3 rounded-lg hover:from-primary-700 hover:to-secondary-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    Start Signing
                  </button>
                </div>
              )}

              {/* Advanced Signature Component */}
              {showSignature && document.status !== 'signed' && (
                <div className="space-y-4">
                  <EnhancedSignatureComponent />
                  
                  {signatureData && (
                    <div className="pt-4 border-t border-gray-200">
                      <button
                        onClick={handleSaveSignature}
                        disabled={isSaving}
                        className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-3 rounded-lg hover:from-green-700 hover:to-green-800 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                      >
                        {isSaving ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            <span>Saving...</span>
                          </>
                        ) : (
                          <>
                            <Save className="w-4 h-4" />
                            <span>Save Signature</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Signed Status */}
              {document.status === 'signed' && (
                <div className="text-center">
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Document Signed</h3>
                  <p className="text-gray-600 mb-6">
                    This document has been successfully signed and is ready for export in various formats.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <button 
                      onClick={() => setShowExportModal(true)}
                      className="flex items-center space-x-2 bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-3 rounded-lg hover:from-green-700 hover:to-green-800 transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                      <FileDown className="w-5 h-5" />
                      <span>Export Document</span>
                    </button>
                    <button 
                      onClick={handleDownload}
                      className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Download className="w-5 h-5" />
                      <span>Quick Download</span>
                    </button>
                  </div>
                </div>
              )}
          </motion.div>
        </div>
      </main>

      {/* Export Modal */}
      {document && (
        <ExportModal 
          isOpen={showExportModal}
          onClose={() => setShowExportModal(false)}
          documentId={document.id}
          documentName={document.name}
        />
      )}
    </div>
  );
};

export default SigningPage;
