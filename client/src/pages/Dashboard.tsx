import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Plus, 
  LogOut, 
  User, 
  Calendar, 
  Download, 
  Eye, 
  Trash2, 
  Settings, 
  Search,
  Upload,
  Clock,
  CheckCircle,
  XCircle,
  Sparkles,
  PenTool,
  FileDown
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import ExportModal from '../components/ExportModal';
import DashboardSettings from '../components/DashboardSettings';

interface Document {
  id: string;
  name: string;
  status: 'pending' | 'signed' | 'rejected';
  createdAt: string;
  size: number;
  signers?: string[];
}

const Dashboard: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'signed' | 'rejected'>('all');
  const [showExportModal, setShowExportModal] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [showSettings, setShowSettings] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  // Fetch user documents
  useEffect(() => {
    const fetchUserDocuments = async () => {
      if (!user) return;
      
      try {
        // Try to fetch from API first
        // const response = await axios.get(`/api/documents/user/${user.id}`);
        // setDocuments(response.data);
        
        // For now, create user-specific mock data
        const userDocuments: Document[] = [
          {
            id: `${user.id}_doc_1`,
            name: `${user.name || 'User'}_Contract.pdf`,
            status: 'pending',
            createdAt: new Date().toISOString(),
            size: 2048576,
            signers: [user.email]
          },
          {
            id: `${user.id}_doc_2`,
            name: `${user.name || 'User'}_Agreement.pdf`,
            status: 'signed',
            createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
            size: 1024768,
            signers: [user.email]
          }
        ];
        
        // Add any documents from localStorage (uploaded documents)
        try {
          const uploadedDocsJson = localStorage.getItem(`documents_${user.id}`);
          const uploadedDocs = uploadedDocsJson ? JSON.parse(uploadedDocsJson) : [];
          setDocuments([...userDocuments, ...uploadedDocs]);
        } catch (storageError) {
          console.warn('Error parsing stored documents:', storageError);
          // Clear corrupted data and use only sample documents
          localStorage.removeItem(`documents_${user.id}`);
          setDocuments(userDocuments);
        }
        
      } catch (error) {
        console.error('Error fetching documents:', error);
        // Fallback to empty array or show error
        setDocuments([]);
      }
    };

    fetchUserDocuments();
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getStatusIcon = (status: Document['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'signed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'rejected':
        return <XCircle className="w-4 h-4 text-red-500" />;
    }
  };

  const getStatusBadge = (status: Document['status']) => {
    const baseClasses = "px-2 py-1 rounded-full text-xs font-medium";
    switch (status) {
      case 'pending':
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case 'signed':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'rejected':
        return `${baseClasses} bg-red-100 text-red-800`;
    }
  };

  const formatFileSize = (bytes: number) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'all' || doc.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  // Handler functions for document actions
  const handlePreviewDocument = (doc: Document) => {
    // Navigate to the signing page for preview
    navigate(`/sign/${doc.id}`);
  };

  const handleDownloadDocument = (doc: Document) => {
    // Try to get the file from localStorage
    const fileData = localStorage.getItem(`file_${doc.id}`);
    if (fileData) {
      const link = document.createElement('a');
      link.href = fileData;
      link.download = doc.name;
      link.click();
    } else {
      // If no file data found, show message
      alert('Document file not found. Please re-upload the document.');
    }
  };

  const handleDeleteDocument = (doc: Document) => {
    if (window.confirm(`Are you sure you want to delete "${doc.name}"? This action cannot be undone.`)) {
      // Remove from localStorage
      const storedDocuments = JSON.parse(localStorage.getItem(`documents_${user?.id}`) || '[]');
      const updatedDocuments = storedDocuments.filter((item: Document) => item.id !== doc.id);
      localStorage.setItem(`documents_${user?.id}`, JSON.stringify(updatedDocuments));
      
      // Also remove the file data
      localStorage.removeItem(`file_${doc.id}`);
      
      // Update state
      setDocuments(prev => prev.filter(item => item.id !== doc.id));
      
      alert('Document deleted successfully!');
    }
  };

  const handleExportDocument = (doc: Document) => {
    setSelectedDocument(doc);
    setShowExportModal(true);
  };

  if (!isAuthenticated || !user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navbar />

      {/* Main Content */}
      <main className="relative z-10 container mx-auto px-4 py-8">
        <motion.div 
          className="max-w-7xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[
              { label: 'Total Documents', value: documents.length, icon: FileText, color: 'primary' },
              { label: 'Pending Signatures', value: documents.filter(d => d.status === 'pending').length, icon: Clock, color: 'yellow' },
              { label: 'Signed Documents', value: documents.filter(d => d.status === 'signed').length, icon: CheckCircle, color: 'green' },
              { label: 'Rejected', value: documents.filter(d => d.status === 'rejected').length, icon: XCircle, color: 'red' },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                className="bg-white/80 backdrop-blur-lg p-6 rounded-2xl shadow-xl border border-white/20"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                    <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-full ${
                    stat.color === 'primary' ? 'bg-primary-100' :
                    stat.color === 'yellow' ? 'bg-yellow-100' :
                    stat.color === 'green' ? 'bg-green-100' :
                    'bg-red-100'
                  }`}>
                    <stat.icon className={`w-6 h-6 ${
                      stat.color === 'primary' ? 'text-primary-600' :
                      stat.color === 'yellow' ? 'text-yellow-600' :
                      stat.color === 'green' ? 'text-green-600' :
                      'text-red-600'
                    }`} />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Actions and Filters */}
          <motion.div 
            className="bg-white/80 backdrop-blur-lg p-6 rounded-2xl shadow-xl border border-white/20 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="flex flex-col sm:flex-row gap-4 flex-1">
                {/* Search */}
                <div className="relative flex-1">
                  <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search documents..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                {/* Filter */}
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value as any)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="signed">Signed</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <Link
                  to="/sign"
                  className="flex items-center space-x-2 bg-gradient-to-r from-primary-600 to-secondary-600 text-white px-6 py-2 rounded-lg hover:from-primary-700 hover:to-secondary-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  <Upload className="w-4 h-4" />
                  <span>Upload Document</span>
                </Link>
                <button 
                  onClick={() => setShowSettings(true)}
                  className="flex items-center space-x-2 bg-gray-100 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <Settings className="w-4 h-4" />
                  <span>Settings</span>
                </button>
              </div>
            </div>
          </motion.div>

          {/* Documents List */}
          <motion.div 
            className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-800">Documents</h2>
              <p className="text-gray-600">Manage your uploaded documents and their signature status</p>
            </div>

            {filteredDocuments.length === 0 ? (
              <div className="p-12 text-center">
                <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">No documents found</h3>
                <p className="text-gray-500 mb-6">
                  {searchQuery ? 'Try adjusting your search criteria' : 'Upload your first document to get started'}
                </p>
                <Link
                  to="/sign"
                  className="inline-flex items-center space-x-2 bg-gradient-to-r from-primary-600 to-secondary-600 text-white px-6 py-3 rounded-lg hover:from-primary-700 hover:to-secondary-700 transition-all duration-300"
                >
                  <Plus className="w-4 h-4" />
                  <span>Upload Document</span>
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Document
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date Created
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Size
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredDocuments.map((document, index) => (
                      <motion.tr
                        key={document.id}
                        className="hover:bg-gray-50 transition-colors"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: 0.1 * index }}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <FileText className="w-8 h-8 text-primary-500 mr-3" />
                            <div>
                              <div className="text-sm font-medium text-gray-900">{document.name}</div>
                              {document.signers && (
                                <div className="text-sm text-gray-500">
                                  Signers: {document.signers.join(', ')}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-2">
                            {getStatusIcon(document.status)}
                            <span className={getStatusBadge(document.status)}>
                              {document.status.charAt(0).toUpperCase() + document.status.slice(1)}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex items-center space-x-2">
                            <Calendar className="w-4 h-4" />
                            <span>{formatDate(document.createdAt)}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatFileSize(document.size)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            {document.status === 'pending' && (
                              <Link
                                to={`/sign/${document.id}`}
                                className="text-blue-600 hover:text-blue-900 p-1 rounded flex items-center space-x-1 bg-blue-50 hover:bg-blue-100 px-2 py-1 transition-colors"
                                title="Sign Document"
                              >
                                <PenTool className="w-4 h-4" />
                                <span className="text-xs">Sign</span>
                              </Link>
                            )}
                            <button 
                              onClick={() => handlePreviewDocument(document)}
                              className="text-primary-600 hover:text-primary-900 p-1 rounded" 
                              title="View Document"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleExportDocument(document)}
                              className="text-purple-600 hover:text-purple-900 p-1 rounded" 
                              title="Export Document"
                            >
                              <FileDown className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleDownloadDocument(document)}
                              className="text-green-600 hover:text-green-900 p-1 rounded" 
                              title="Download Document"
                            >
                              <Download className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleDeleteDocument(document)}
                              className="text-red-600 hover:text-red-900 p-1 rounded" 
                              title="Delete Document"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </motion.div>
        </motion.div>
      </main>

      {/* Export Modal */}
      {selectedDocument && (
        <ExportModal 
          isOpen={showExportModal}
          onClose={() => {
            setShowExportModal(false);
            setSelectedDocument(null);
          }}
          documentId={selectedDocument.id}
          documentName={selectedDocument.name}
        />
      )}

      {/* Settings Modal */}
      <DashboardSettings
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
      />
    </div>
  );
};

export default Dashboard;
