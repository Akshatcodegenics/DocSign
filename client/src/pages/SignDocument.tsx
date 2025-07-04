import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Upload, FileText, CheckCircle, ArrowLeft, Cloud, Shield, Zap, Download, User, LogIn, Sparkles, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const SignDocument: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setUploadError('');
    setUploadSuccess('');
    
    if (file && file.type === 'application/pdf') {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        setUploadError('File size must be less than 10MB');
        return;
      }
      setSelectedFile(file);
    } else {
      setUploadError('Please select a PDF file');
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    setUploadError('');
    setUploadSuccess('');
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.type === 'application/pdf') {
        if (file.size > 10 * 1024 * 1024) {
          setUploadError('File size must be less than 10MB');
          return;
        }
        setSelectedFile(file);
      } else {
        setUploadError('Please select a PDF file');
      }
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: '/sign' } } });
      return;
    }
    
    setIsUploading(true);
    setUploadError('');
    setUploadSuccess('');
    
    try {
      const formData = new FormData();
      formData.append('document', selectedFile);
      
      // For now, simulate successful upload and save to localStorage
      // TODO: Replace with actual API call when upload endpoint is ready
      // const response = await axios.post('/api/docs/upload', formData, {
      //   headers: {
      //     'Content-Type': 'multipart/form-data',
      //   },
      // });
      
      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Create document object and save to localStorage
      const documentId = `doc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const newDocument = {
        id: documentId,
        name: selectedFile.name,
        status: 'pending' as const,
        createdAt: new Date().toISOString(),
        size: selectedFile.size,
        signers: [user?.email || 'user@example.com'],
        fileUrl: URL.createObjectURL(selectedFile) // Create blob URL for preview
      };
      
      // Save to localStorage for current user
      const userDocuments = JSON.parse(localStorage.getItem(`documents_${user?.id}`) || '[]');
      userDocuments.push(newDocument);
      localStorage.setItem(`documents_${user?.id}`, JSON.stringify(userDocuments));
      
      // Also save the file data for later access
      const reader = new FileReader();
      reader.onload = () => {
        localStorage.setItem(`file_${documentId}`, reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
      
      setUploadSuccess('Document uploaded successfully!');
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (error: any) {
      setUploadError(error.response?.data?.error || 'Upload failed. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-secondary-50 to-accent-50 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-10 -left-10 w-72 h-72 bg-gradient-to-r from-primary-200 to-secondary-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float"></div>
        <div className="absolute top-40 -right-10 w-72 h-72 bg-gradient-to-r from-accent-200 to-primary-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-gradient-to-r from-secondary-200 to-accent-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float" style={{ animationDelay: '4s' }}></div>
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
            <Link 
              to="/" 
              className="flex items-center space-x-2 text-white hover:text-blue-200 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-semibold">Back to Home</span>
            </Link>
            
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white/20 rounded-full backdrop-blur-sm">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">SignFlow</h1>
                <p className="text-sm text-blue-100">Upload & Sign Documents</p>
              </div>
            </div>
            
            {/* Authentication Status */}
            <div className="flex items-center space-x-4">
              {isAuthenticated && user ? (
                <div className="flex items-center space-x-2 bg-white/10 rounded-full px-4 py-2">
                  <User className="w-5 h-5" />
                  <span className="font-semibold">{user.name}</span>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 rounded-full px-4 py-2 transition-colors"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Sign In</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="relative z-10 container mx-auto px-4 py-16">
        <motion.div 
          className="max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {/* Main Upload Section */}
          <motion.div 
            className="bg-white/80 backdrop-blur-lg p-8 rounded-2xl shadow-2xl border border-white/20 mb-8"
            whileHover={{ scale: 1.01 }}
            transition={{ duration: 0.2 }}
          >
            <div className="text-center mb-8">
              <motion.div 
                className="w-16 h-16 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center mx-auto mb-4"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
              >
                <Upload className="w-8 h-8 text-white" />
              </motion.div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Upload Document</h2>
              <p className="text-gray-600">Upload your PDF document to add digital signatures</p>
            </div>

            {/* Error/Success Messages */}
            {uploadError && (
              <motion.div 
                className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center space-x-2">
                  <AlertCircle className="w-5 h-5 text-red-500" />
                  <p className="text-red-700 text-sm">{uploadError}</p>
                </div>
              </motion.div>
            )}

            {uploadSuccess && (
              <motion.div 
                className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <p className="text-green-700 text-sm">{uploadSuccess}</p>
                </div>
              </motion.div>
            )}

            {/* Upload Area */}
            <motion.div
              className={`relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 ${
                isDragOver
                  ? 'border-primary-400 bg-primary-50'
                  : selectedFile
                  ? 'border-green-400 bg-green-50'
                  : 'border-gray-300 hover:border-primary-400 hover:bg-primary-50'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf"
                onChange={handleFileSelect}
                className="hidden"
                id="file-upload"
              />
              
              {selectedFile ? (
                <div className="space-y-4">
                  <motion.div 
                    className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5, type: "spring" }}
                  >
                    <FileText className="w-8 h-8 text-white" />
                  </motion.div>
                  <div>
                    <h3 className="text-lg font-semibold text-green-800 mb-2">File Selected</h3>
                    <p className="text-green-700 font-medium">{selectedFile.name}</p>
                    <p className="text-sm text-green-600 mt-1">
                      Size: {formatFileSize(selectedFile.size)} • Type: PDF
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedFile(null)}
                    className="text-sm text-green-600 hover:text-green-800 underline"
                  >
                    Choose different file
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <motion.div 
                    className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Cloud className="w-8 h-8 text-gray-400" />
                  </motion.div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">
                      {isDragOver ? 'Drop your PDF here' : 'Choose PDF file'}
                    </h3>
                    <p className="text-gray-500 mb-4">
                      Drag and drop your PDF file here, or click to browse
                    </p>
                    <label
                      htmlFor="file-upload"
                      className="cursor-pointer inline-flex items-center space-x-2 bg-gradient-to-r from-primary-600 to-secondary-600 text-white px-6 py-3 rounded-lg hover:from-primary-700 hover:to-secondary-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                      <Upload className="w-4 h-4" />
                      <span>Select File</span>
                    </label>
                    <p className="text-xs text-gray-400 mt-3">Maximum file size: 10MB</p>
                  </div>
                </div>
              )}
            </motion.div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <motion.button
                onClick={handleUpload}
                disabled={!selectedFile || isUploading}
                className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-all duration-300 ${
                  selectedFile && !isUploading
                    ? 'bg-gradient-to-r from-green-600 to-green-700 text-white hover:from-green-700 hover:to-green-800 shadow-lg hover:shadow-xl'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
                whileHover={selectedFile && !isUploading ? { scale: 1.02 } : {}}
                whileTap={selectedFile && !isUploading ? { scale: 0.98 } : {}}
              >
                {isUploading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Uploading...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-2">
                    <Upload className="w-5 h-5" />
                    <span>{isAuthenticated ? 'Upload & Continue' : 'Sign In to Upload'}</span>
                  </div>
                )}
              </motion.button>
              
              <Link
                to="/"
                className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-center"
              >
                Cancel
              </Link>
            </div>
          </motion.div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {[
              {
                icon: Shield,
                title: 'Secure Upload',
                description: 'Your documents are encrypted and protected with bank-level security',
                color: 'green'
              },
              {
                icon: Zap,
                title: 'Quick Processing',
                description: 'Documents are processed instantly with our optimized workflow',
                color: 'blue'
              },
              {
                icon: Download,
                title: 'Easy Download',
                description: 'Download your signed documents immediately after completion',
                color: 'purple'
              }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                className="bg-white/60 backdrop-blur-lg p-6 rounded-2xl shadow-lg border border-white/20"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
                whileHover={{ scale: 1.02 }}
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${
                  feature.color === 'green' ? 'bg-green-100' :
                  feature.color === 'blue' ? 'bg-blue-100' :
                  'bg-purple-100'
                }`}>
                  <feature.icon className={`w-6 h-6 ${
                    feature.color === 'green' ? 'text-green-600' :
                    feature.color === 'blue' ? 'text-blue-600' :
                    'text-purple-600'
                  }`} />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </div>

          {/* How it Works */}
          <motion.div 
            className="bg-gradient-to-r from-primary-500/10 to-secondary-500/10 backdrop-blur-lg p-8 rounded-2xl border border-white/20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">How It Works</h3>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { step: '1', title: 'Upload', description: 'Select and upload your PDF document' },
                { step: '2', title: 'Sign', description: 'Add your digital signature to the document' },
                { step: '3', title: 'Download', description: 'Download your signed document immediately' }
              ].map((step, index) => (
                <div key={step.step} className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-lg">
                    {step.step}
                  </div>
                  <h4 className="font-semibold text-gray-800 mb-2">{step.title}</h4>
                  <p className="text-gray-600 text-sm">{step.description}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
};

export default SignDocument;
