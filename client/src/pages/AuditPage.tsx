import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, 
  Clock, 
  FileText, 
  CheckCircle, 
  XCircle, 
  Hash, 
  Search,
  Filter,
  Download,
  Eye,
  Calendar,
  User,
  MapPin,
  Fingerprint,
  Key,
  Link as LinkIcon,
  AlertTriangle,
  Sparkles
} from 'lucide-react';
import Navbar from '../components/Navbar';

interface AuditEntry {
  id: string;
  documentId: string;
  documentName: string;
  action: 'created' | 'signed' | 'viewed' | 'modified' | 'verified';
  timestamp: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
  ipAddress: string;
  location: string;
  blockchainHash: string;
  biometricData?: {
    signatureHash: string;
    pressurePoints: number;
    strokeDuration: number;
  };
  verificationStatus: 'verified' | 'pending' | 'failed';
}

const AuditPage: React.FC = () => {
  const [auditEntries, setAuditEntries] = useState<AuditEntry[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterAction, setFilterAction] = useState<'all' | AuditEntry['action']>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | AuditEntry['verificationStatus']>('all');
  const [selectedEntry, setSelectedEntry] = useState<AuditEntry | null>(null);

  // Mock audit data - replace with actual API call
  useEffect(() => {
    setAuditEntries([
      {
        id: '1',
        documentId: '001',
        documentName: 'Contract_Agreement.pdf',
        action: 'created',
        timestamp: '2024-01-15T10:30:00Z',
        user: { id: 'u1', name: 'John Doe', email: 'john@example.com' },
        ipAddress: '192.168.1.100',
        location: 'New York, NY',
        blockchainHash: '0x4a5b2c8d9e1f3a7b6c4d8e2f9a3b7c5d1e8f4a6b9c2d5e8f1a4b7c9e2f5a8b',
        verificationStatus: 'verified'
      },
      {
        id: '2',
        documentId: '001',
        documentName: 'Contract_Agreement.pdf',
        action: 'signed',
        timestamp: '2024-01-15T14:22:00Z',
        user: { id: 'u2', name: 'Jane Smith', email: 'jane@example.com' },
        ipAddress: '10.0.0.45',
        location: 'San Francisco, CA',
        blockchainHash: '0x7f8e9d0c1b2a3f6e5d4c7b8e1f4a7b6c9d2e5f8a1b4c7e0d3f6a9c2e5b8d1f',
        biometricData: {
          signatureHash: '0x9a8b7c6d5e4f3a2b1c9d8e7f6a5b4c3d2e1f9a8b7c6d5e4f3a2b1c9d8e7f',
          pressurePoints: 45,
          strokeDuration: 2.3
        },
        verificationStatus: 'verified'
      },
      {
        id: '3',
        documentId: '002',
        documentName: 'Employee_Handbook.pdf',
        action: 'viewed',
        timestamp: '2024-01-16T09:15:00Z',
        user: { id: 'u3', name: 'Mike Wilson', email: 'mike@example.com' },
        ipAddress: '172.16.0.23',
        location: 'Chicago, IL',
        blockchainHash: '0x3d2e1f9a8b7c6d5e4f3a2b1c9d8e7f6a5b4c3d2e1f9a8b7c6d5e4f3a2b1c',
        verificationStatus: 'pending'
      },
      {
        id: '4',
        documentId: '003',
        documentName: 'Privacy_Policy.pdf',
        action: 'modified',
        timestamp: '2024-01-17T16:45:00Z',
        user: { id: 'u4', name: 'Sarah Johnson', email: 'sarah@example.com' },
        ipAddress: '203.0.113.42',
        location: 'Austin, TX',
        blockchainHash: '0x8c7b6a5f4e3d2c1b9a8f7e6d5c4b3a2f1e0d9c8b7a6f5e4d3c2b1a0f9e8d',
        verificationStatus: 'failed'
      }
    ]);
  }, []);

  const getActionIcon = (action: AuditEntry['action']) => {
    switch (action) {
      case 'created': return <FileText className="w-4 h-4 text-blue-500" />;
      case 'signed': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'viewed': return <Eye className="w-4 h-4 text-purple-500" />;
      case 'modified': return <AlertTriangle className="w-4 h-4 text-orange-500" />;
      case 'verified': return <Shield className="w-4 h-4 text-teal-500" />;
    }
  };

  const getStatusBadge = (status: AuditEntry['verificationStatus']) => {
    const baseClasses = "px-2 py-1 rounded-full text-xs font-medium";
    switch (status) {
      case 'verified':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'pending':
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case 'failed':
        return `${baseClasses} bg-red-100 text-red-800`;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredEntries = auditEntries.filter(entry => {
    const matchesSearch = 
      entry.documentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesAction = filterAction === 'all' || entry.action === filterAction;
    const matchesStatus = filterStatus === 'all' || entry.verificationStatus === filterStatus;
    return matchesSearch && matchesAction && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-center mb-4">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full">
              <Shield className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Blockchain Audit Trail
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Immutable records of all document activities secured by blockchain technology for complete transparency and tamper-proof verification.
          </p>
        </motion.div>

        {/* Filters and Search */}
        <motion.div 
          className="bg-white/80 backdrop-blur-lg p-6 rounded-2xl shadow-xl border border-white/20 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search documents, users, or activities..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Filters */}
              <div className="flex gap-3">
                <select
                  value={filterAction}
                  onChange={(e) => setFilterAction(e.target.value as any)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Actions</option>
                  <option value="created">Created</option>
                  <option value="signed">Signed</option>
                  <option value="viewed">Viewed</option>
                  <option value="modified">Modified</option>
                  <option value="verified">Verified</option>
                </select>

                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value as any)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Status</option>
                  <option value="verified">Verified</option>
                  <option value="pending">Pending</option>
                  <option value="failed">Failed</option>
                </select>
              </div>
            </div>

            {/* Export Button */}
            <button className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl">
              <Download className="w-4 h-4" />
              <span>Export Audit Log</span>
            </button>
          </div>
        </motion.div>

        {/* Statistics Cards */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {[
            { label: 'Total Entries', value: auditEntries.length, icon: FileText, color: 'blue' },
            { label: 'Verified', value: auditEntries.filter(e => e.verificationStatus === 'verified').length, icon: CheckCircle, color: 'green' },
            { label: 'Pending', value: auditEntries.filter(e => e.verificationStatus === 'pending').length, icon: Clock, color: 'yellow' },
            { label: 'Failed', value: auditEntries.filter(e => e.verificationStatus === 'failed').length, icon: XCircle, color: 'red' },
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
                  stat.color === 'blue' ? 'bg-blue-100' :
                  stat.color === 'green' ? 'bg-green-100' :
                  stat.color === 'yellow' ? 'bg-yellow-100' :
                  'bg-red-100'
                }`}>
                  <stat.icon className={`w-6 h-6 ${
                    stat.color === 'blue' ? 'text-blue-600' :
                    stat.color === 'green' ? 'text-green-600' :
                    stat.color === 'yellow' ? 'text-yellow-600' :
                    'text-red-600'
                  }`} />
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Audit Trail Table */}
        <motion.div 
          className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-800">Audit Trail Records</h2>
            <p className="text-gray-600">Chronological log of all document activities with blockchain verification</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Document & Action
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User & Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Timestamp
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Verification
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Blockchain Hash
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredEntries.map((entry, index) => (
                  <motion.tr
                    key={entry.id}
                    className="hover:bg-gray-50 transition-colors cursor-pointer"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 * index }}
                    onClick={() => setSelectedEntry(entry)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getActionIcon(entry.action)}
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">{entry.documentName}</div>
                          <div className="text-sm text-gray-500 capitalize">{entry.action}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{entry.user.name}</div>
                      <div className="text-sm text-gray-500 flex items-center">
                        <MapPin className="w-3 h-3 mr-1" />
                        {entry.location}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="w-4 h-4 mr-2" />
                        {formatDate(entry.timestamp)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={getStatusBadge(entry.verificationStatus)}>
                        {entry.verificationStatus.charAt(0).toUpperCase() + entry.verificationStatus.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-500">
                        <Hash className="w-4 h-4 mr-2" />
                        <span className="font-mono truncate max-w-32">{entry.blockchainHash}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button className="text-blue-600 hover:text-blue-900 p-1 rounded" title="View Details">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="text-green-600 hover:text-green-900 p-1 rounded" title="Verify on Blockchain">
                          <LinkIcon className="w-4 h-4" />
                        </button>
                        {entry.biometricData && (
                          <button className="text-purple-600 hover:text-purple-900 p-1 rounded" title="Biometric Data">
                            <Fingerprint className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredEntries.length === 0 && (
            <div className="p-12 text-center">
              <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">No audit entries found</h3>
              <p className="text-gray-500">Try adjusting your search criteria or filters</p>
            </div>
          )}
        </motion.div>

        {/* Blockchain Security Info */}
        <motion.div 
          className="mt-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <Key className="w-8 h-8 mr-3" />
              <h2 className="text-2xl font-bold">Blockchain Security</h2>
            </div>
            <p className="text-lg mb-6 opacity-90">
              All audit trail entries are cryptographically secured and stored on an immutable blockchain, 
              ensuring complete transparency and tamper-proof verification of document activities.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <Shield className="w-8 h-8 mx-auto mb-2 opacity-80" />
                <h3 className="font-semibold mb-1">Immutable Records</h3>
                <p className="text-sm opacity-75">Once recorded, entries cannot be modified or deleted</p>
              </div>
              <div className="text-center">
                <Hash className="w-8 h-8 mx-auto mb-2 opacity-80" />
                <h3 className="font-semibold mb-1">Cryptographic Hashing</h3>
                <p className="text-sm opacity-75">Each entry is secured with SHA-256 encryption</p>
              </div>
              <div className="text-center">
                <Fingerprint className="w-8 h-8 mx-auto mb-2 opacity-80" />
                <h3 className="font-semibold mb-1">Biometric Verification</h3>
                <p className="text-sm opacity-75">Digital signatures include biometric data validation</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AuditPage;
