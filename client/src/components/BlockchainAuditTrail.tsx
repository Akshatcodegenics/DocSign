import React, { useState, useCallback, useEffect } from 'react';
import { Shield, Clock, User, MapPin, Hash, Check, AlertTriangle } from 'lucide-react';

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

interface BlockchainAuditTrailProps {
  onNewEntry: (entry: BlockchainEntry) => void;
  entries: BlockchainEntry[];
}

const BlockchainAuditTrail: React.FC<BlockchainAuditTrailProps> = ({
  onNewEntry,
  entries
}) => {
  const [isBlockchainEnabled, setIsBlockchainEnabled] = useState(false);
  const [lastBlock, setLastBlock] = useState<BlockchainEntry | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResults, setVerificationResults] = useState<Map<string, boolean>>(new Map());

  // Simple hash function for demonstration (in production, use proper cryptographic hash)
  const simpleHash = useCallback((data: string): string => {
    let hash = 0;
    for (let i = 0; i < data.length; i++) {
      const char = data.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash).toString(16).padStart(8, '0');
  }, []);

  // Create a new blockchain entry
  const createBlockchainEntry = useCallback(async (
    action: string,
    userId: string,
    documentHash: string,
    signatureHash: string
  ): Promise<BlockchainEntry> => {
    const timestamp = Date.now();
    const ipAddress = 'xxx.xxx.xxx.xxx'; // Would get from API
    const geolocation = { lat: 0, lng: 0 }; // Would get from geolocation API
    
    // Get previous hash
    const previousHash = lastBlock ? lastBlock.blockHash : '0'.repeat(64);
    
    // Create merkle root (simplified)
    const merkleRoot = simpleHash(`${action}${userId}${documentHash}${signatureHash}${timestamp}`);
    
    // Simple proof of work (in production, use proper PoW or PoS)
    let nonce = 0;
    let blockData = `${previousHash}${timestamp}${action}${userId}${documentHash}${signatureHash}${merkleRoot}${nonce}`;
    let blockHash = simpleHash(blockData);
    
    // Find a hash that starts with '0' (very simple PoW)
    while (!blockHash.startsWith('0')) {
      nonce++;
      blockData = `${previousHash}${timestamp}${action}${userId}${documentHash}${signatureHash}${merkleRoot}${nonce}`;
      blockHash = simpleHash(blockData);
    }
    
    const entry: BlockchainEntry = {
      id: `block-${timestamp}-${nonce}`,
      blockHash,
      previousHash,
      timestamp,
      action,
      userId,
      documentHash,
      signatureHash,
      ipAddress,
      geolocation,
      merkleRoot,
      nonce,
      verified: true
    };
    
    setLastBlock(entry);
    return entry;
  }, [lastBlock, simpleHash]);

  // Add entry to blockchain
  const addBlockchainEntry = useCallback(async (
    action: string,
    userId: string = 'anonymous',
    documentHash: string = 'doc-hash',
    signatureHash: string = 'sig-hash'
  ) => {
    if (!isBlockchainEnabled) return;
    
    try {
      const entry = await createBlockchainEntry(action, userId, documentHash, signatureHash);
      onNewEntry(entry);
    } catch (error) {
      console.error('Error creating blockchain entry:', error);
    }
  }, [isBlockchainEnabled, createBlockchainEntry, onNewEntry]);

  // Verify blockchain integrity
  const verifyBlockchain = useCallback(async () => {
    setIsVerifying(true);
    const results = new Map<string, boolean>();
    
    for (let i = 0; i < entries.length; i++) {
      const entry = entries[i];
      
      // Verify hash
      const blockData = `${entry.previousHash}${entry.timestamp}${entry.action}${entry.userId}${entry.documentHash}${entry.signatureHash}${entry.merkleRoot}${entry.nonce}`;
      const calculatedHash = simpleHash(blockData);
      const hashValid = calculatedHash === entry.blockHash;
      
      // Verify chain (previous hash matches)
      let chainValid = true;
      if (i > 0) {
        const previousEntry = entries[i - 1];
        chainValid = entry.previousHash === previousEntry.blockHash;
      }
      
      results.set(entry.id, hashValid && chainValid);
    }
    
    setVerificationResults(results);
    setIsVerifying(false);
  }, [entries, simpleHash]);

  // Auto-verify when entries change
  useEffect(() => {
    if (entries.length > 0) {
      verifyBlockchain();
    }
  }, [entries, verifyBlockchain]);

  const getLocationString = (geo?: { lat: number; lng: number }) => {
    if (!geo) return 'Unknown';
    return `${geo.lat.toFixed(4)}, ${geo.lng.toFixed(4)}`;
  };

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <div className="border rounded-lg p-4 bg-white">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-semibold text-gray-700 flex items-center gap-2">
          <Shield size={16} />
          Blockchain Audit Trail
        </h3>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsBlockchainEnabled(!isBlockchainEnabled)}
            className={`px-3 py-1 rounded text-sm ${
              isBlockchainEnabled 
                ? 'bg-green-500 text-white' 
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            {isBlockchainEnabled ? 'Enabled' : 'Disabled'}
          </button>
          
          <button
            onClick={verifyBlockchain}
            disabled={isVerifying || entries.length === 0}
            className="px-3 py-1 bg-blue-500 text-white rounded text-sm disabled:opacity-50"
          >
            {isVerifying ? 'Verifying...' : 'Verify Chain'}
          </button>
        </div>
      </div>

      {!isBlockchainEnabled && (
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-center gap-2 text-yellow-800">
            <AlertTriangle size={16} />
            <span className="text-sm">
              Blockchain audit trail is disabled. Enable it to create immutable records.
            </span>
          </div>
        </div>
      )}

      {entries.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <Shield size={32} className="mx-auto mb-2 opacity-50" />
          <p>No blockchain entries yet</p>
          <p className="text-sm">Actions will be recorded once blockchain is enabled</p>
        </div>
      ) : (
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {entries.map((entry, index) => {
            const isVerified = verificationResults.get(entry.id) ?? false;
            
            return (
              <div
                key={entry.id}
                className={`p-3 rounded-lg border-l-4 ${
                  isVerified 
                    ? 'border-green-500 bg-green-50' 
                    : 'border-red-500 bg-red-50'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">Block #{index + 1}</span>
                    {isVerified ? (
                      <Check size={14} className="text-green-600" />
                    ) : (
                      <AlertTriangle size={14} className="text-red-600" />
                    )}
                  </div>
                  <span className="text-xs text-gray-500">
                    {formatTimestamp(entry.timestamp)}
                  </span>
                </div>
                
                <div className="space-y-1 text-sm">
                  <div className="flex items-center gap-2">
                    <User size={12} className="text-gray-400" />
                    <span className="font-medium">{entry.action}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin size={12} className="text-gray-400" />
                    <span>User: {entry.userId}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin size={12} className="text-gray-400" />
                    <span>Location: {getLocationString(entry.geolocation)}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-gray-600">
                    <Hash size={12} className="text-gray-400" />
                    <span className="font-mono text-xs">
                      Hash: {entry.blockHash.substring(0, 16)}...
                    </span>
                  </div>
                  
                  {entry.previousHash !== '0'.repeat(64) && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <Hash size={12} className="text-gray-400" />
                      <span className="font-mono text-xs">
                        Prev: {entry.previousHash.substring(0, 16)}...
                      </span>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-2 text-gray-600">
                    <Clock size={12} className="text-gray-400" />
                    <span>Nonce: {entry.nonce}</span>
                  </div>
                </div>
                
                {/* Expandable details */}
                <details className="mt-2">
                  <summary className="cursor-pointer text-xs text-blue-600 hover:text-blue-800">
                    View full details
                  </summary>
                  <div className="mt-2 p-2 bg-gray-100 rounded text-xs font-mono space-y-1">
                    <div><strong>Block Hash:</strong> {entry.blockHash}</div>
                    <div><strong>Previous Hash:</strong> {entry.previousHash}</div>
                    <div><strong>Merkle Root:</strong> {entry.merkleRoot}</div>
                    <div><strong>Document Hash:</strong> {entry.documentHash}</div>
                    <div><strong>Signature Hash:</strong> {entry.signatureHash}</div>
                    <div><strong>IP Address:</strong> {entry.ipAddress}</div>
                    <div><strong>Verification:</strong> 
                      <span className={isVerified ? 'text-green-600' : 'text-red-600'}>
                        {isVerified ? ' ✓ Valid' : ' ✗ Invalid'}
                      </span>
                    </div>
                  </div>
                </details>
              </div>
            );
          })}
        </div>
      )}

      {/* Blockchain Stats */}
      {entries.length > 0 && (
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-lg font-bold text-blue-600">{entries.length}</div>
              <div className="text-xs text-gray-600">Total Blocks</div>
            </div>
            <div>
              <div className="text-lg font-bold text-green-600">
                {Array.from(verificationResults.values()).filter(v => v).length}
              </div>
              <div className="text-xs text-gray-600">Verified Blocks</div>
            </div>
            <div>
              <div className="text-lg font-bold text-purple-600">
                {entries.reduce((sum, e) => sum + e.nonce, 0)}
              </div>
              <div className="text-xs text-gray-600">Total Work</div>
            </div>
          </div>
        </div>
      )}

      {/* Test Buttons for Demo */}
      {isBlockchainEnabled && (
        <div className="mt-4 pt-3 border-t">
          <div className="text-xs text-gray-600 mb-2">Demo Actions:</div>
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => addBlockchainEntry('Document uploaded', 'user123')}
              className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs"
            >
              Add Upload Entry
            </button>
            <button
              onClick={() => addBlockchainEntry('Signature added', 'user123')}
              className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs"
            >
              Add Signature Entry
            </button>
            <button
              onClick={() => addBlockchainEntry('Document signed', 'user123')}
              className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs"
            >
              Add Completion Entry
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlockchainAuditTrail;
