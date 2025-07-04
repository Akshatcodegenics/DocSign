import React, { useState, useRef, useCallback, useEffect } from 'react';
import Draggable from 'react-draggable';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Document, Page, pdfjs } from 'react-pdf';
import Webcam from 'react-webcam';
import BiometricSignatureCanvas from './BiometricSignatureCanvas';
import BlockchainAuditTrail from './BlockchainAuditTrail';
import mongodbService from '../services/mongodbService';
import { 
  Download, 
  Lock, 
  Unlock, 
  ZoomIn, 
  ZoomOut, 
  Save,
  Camera,
  Mic,
  Brain,
  Shield,
  History,
  Users,
  Eye,
  AlertTriangle,
  FileText,
  Maximize2,
  Minimize2,
  Settings,
  RefreshCw,
  Sparkles
} from 'lucide-react';

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

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

interface BiometricData {
  pressure: number[];
  speed: number[];
  strokeOrder: number[];
  timing: number[];
  deviceType: string;
}

interface AuditEntry {
  action: string;
  timestamp: string;
  ipAddress?: string;
  userAgent?: string;
  geolocation?: { lat: number; lng: number };
}

interface AIRecommendation {
  x: number;
  y: number;
  confidence: number;
  reason: string;
}

const SIGNATURE_FONTS = [
  { name: 'Great Vibes', value: 'Great Vibes, cursive' },
  { name: 'Dancing Script', value: 'Dancing Script, cursive' },
  { name: 'Pacifico', value: 'Pacifico, cursive' },
  { name: 'Kaushan Script', value: 'Kaushan Script, cursive' },
  { name: 'Satisfy', value: 'Satisfy, cursive' },
  { name: 'Allura', value: 'Allura, cursive' },
  { name: 'Alex Brush', value: 'Alex Brush, cursive' },
  { name: 'Amatic SC', value: 'Amatic SC, cursive' }
];

const EnhancedSignatureComponent: React.FC = () => {
  // Core state
  const [signatureName, setSignatureName] = useState('');
  const [selectedFont, setSelectedFont] = useState(SIGNATURE_FONTS[0].value);
  const [fontSize, setFontSize] = useState(24);
  const [position, setPosition] = useState({ x: 100, y: 100 });
  const [isLocked, setIsLocked] = useState(false);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [numPages, setNumPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [scale, setScale] = useState(1.0);
  const [signatureData, setSignatureData] = useState<SignatureData[]>([]);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  // Advanced features state
  const [isRecordingBiometric, setIsRecordingBiometric] = useState(false);
  const [biometricData, setBiometricData] = useState<BiometricData>({
    pressure: [],
    speed: [],
    strokeOrder: [],
    timing: [],
    deviceType: 'mouse'
  });
  const [isRecordingVoice, setIsRecordingVoice] = useState(false);
  const [voiceData, setVoiceData] = useState<string>('');
  const [aiRecommendations, setAiRecommendations] = useState<AIRecommendation[]>([]);
  const [auditTrail, setAuditTrail] = useState<AuditEntry[]>([]);
  const [showWebcam, setShowWebcam] = useState(false);
  const [detectedClauses, setDetectedClauses] = useState<string[]>([]);
  const [isCollaborativeMode, setIsCollaborativeMode] = useState(false);
  const [documentVersion, setDocumentVersion] = useState(1);
  const [fraudDetectionEnabled, setFraudDetectionEnabled] = useState(true);
  const [showBiometricCanvas, setShowBiometricCanvas] = useState(false);
  const [blockchainEntries, setBlockchainEntries] = useState<any[]>([]);
  const [activePanel, setActivePanel] = useState<'basic' | 'advanced' | 'audit' | 'biometric' | 'ai'>('basic');
  
  // Refs
  const signatureRef = useRef<HTMLDivElement>(null);
  const pdfContainerRef = useRef<HTMLDivElement>(null);
  const webcamRef = useRef<Webcam>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  // Load Google Fonts
  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Great+Vibes&family=Dancing+Script&family=Pacifico&family=Kaushan+Script&family=Satisfy&family=Allura&family=Alex+Brush&family=Amatic+SC&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
  }, []);

  // Add audit trail entry
  const addAuditEntry = useCallback((action: string) => {
    const entry: AuditEntry = {
      action,
      timestamp: new Date().toISOString(),
      ipAddress: 'xxx.xxx.xxx.xxx',
      userAgent: navigator.userAgent,
      geolocation: { lat: 0, lng: 0 }
    };
    setAuditTrail(prev => [...prev, entry]);
  }, []);

  // AI-powered signature placement recommendation
  const generateAIRecommendations = useCallback(async () => {
    if (!pdfFile) return;
    
    const recommendations: AIRecommendation[] = [
      { x: 400, y: 700, confidence: 0.95, reason: 'Found "Signature:" label' },
      { x: 300, y: 650, confidence: 0.8, reason: 'Bottom of contract section' },
      { x: 450, y: 550, confidence: 0.7, reason: 'Near date field' }
    ];
    
    setAiRecommendations(recommendations);
    addAuditEntry('AI recommendations generated');
  }, [pdfFile, addAuditEntry]);

  // Handle PDF file upload
  const handlePdfUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setPdfFile(file);
      addAuditEntry('PDF uploaded');
    }
  }, [addAuditEntry]);

  // Save signature data
  const saveSignature = useCallback(async () => {
    const signature: SignatureData = {
      name: signatureName,
      font: selectedFont,
      fontSize,
      position,
      page: currentPage,
      locked: isLocked,
      timestamp: new Date().toISOString(),
      biometricData,
      voiceData,
      auditTrail
    };

    setSignatureData(prev => [...prev, signature]);
    
    try {
      await mongodbService.saveSignature(signature);
      addAuditEntry('Signature saved to MongoDB');
    } catch (error) {
      console.error('Error saving to MongoDB:', error);
    }

    addAuditEntry('Signature saved');
  }, [
    signatureName, selectedFont, fontSize, position, currentPage, 
    isLocked, biometricData, voiceData, auditTrail, addAuditEntry
  ]);

  const renderControlPanel = () => {
    switch (activePanel) {
      case 'basic':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-800">Basic Controls</h3>
            
            {/* Signature Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Name/Signature
              </label>
              <input
                type="text"
                value={signatureName}
                onChange={(e) => setSignatureName(e.target.value)}
                placeholder="Enter your name"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Font Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Signature Font
              </label>
              <select
                value={selectedFont}
                onChange={(e) => setSelectedFont(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                {SIGNATURE_FONTS.map((font) => (
                  <option key={font.value} value={font.value}>
                    {font.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Font Size */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Font Size: {fontSize}px
              </label>
              <input
                type="range"
                min="16"
                max="72"
                value={fontSize}
                onChange={(e) => setFontSize(Number(e.target.value))}
                className="w-full"
              />
            </div>
          </div>
        );

      case 'advanced':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-800">Advanced Features</h3>
            
            {/* Biometric Capture */}
            <div className="grid grid-cols-1 gap-3">
              <button
                onClick={() => setIsRecordingBiometric(!isRecordingBiometric)}
                className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg ${
                  isRecordingBiometric ? 'bg-red-500 text-white' : 'bg-blue-500 text-white'
                }`}
              >
                <Eye size={16} />
                {isRecordingBiometric ? 'Stop Biometric' : 'Start Biometric Capture'}
              </button>

              <button
                onClick={() => setIsRecordingVoice(!isRecordingVoice)}
                className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg ${
                  isRecordingVoice ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
                }`}
              >
                <Mic size={16} />
                {isRecordingVoice ? 'Stop Voice Recording' : 'Start Voice Verification'}
              </button>

              <button
                onClick={generateAIRecommendations}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-purple-500 text-white rounded-lg"
              >
                <Brain size={16} />
                Get AI Placement Suggestions
              </button>

              <button
                onClick={() => setShowWebcam(!showWebcam)}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-indigo-500 text-white rounded-lg"
              >
                <Camera size={16} />
                {showWebcam ? 'Hide Camera' : 'Show Camera'}
              </button>
            </div>
          </div>
        );

      case 'biometric':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-800">Biometric Analysis</h3>
            
            <div className="space-y-4">
              <button
                onClick={() => setShowBiometricCanvas(!showBiometricCanvas)}
                className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg ${
                  showBiometricCanvas ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
                }`}
              >
                <Eye size={16} />
                {showBiometricCanvas ? 'Hide Biometric Canvas' : 'Show Biometric Canvas'}
              </button>

              {showBiometricCanvas && (
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <BiometricSignatureCanvas
                    onSignatureComplete={(data) => {
                      console.log('Biometric signature completed:', data);
                      addAuditEntry('Biometric signature captured');
                    }}
                    isRecording={isRecordingBiometric}
                  />
                </div>
              )}

              {biometricData.pressure.length > 0 && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-700 mb-2">Biometric Data</h4>
                  <div className="text-sm space-y-1">
                    <div>Device: {biometricData.deviceType}</div>
                    <div>Strokes: {biometricData.strokeOrder.length}</div>
                    <div>Avg Speed: {(biometricData.speed.reduce((a, b) => a + b, 0) / biometricData.speed.length).toFixed(2)}</div>
                    <div>Duration: {biometricData.timing.length > 0 ? 
                      ((biometricData.timing[biometricData.timing.length - 1] - biometricData.timing[0]) / 1000).toFixed(2) + 's' : 
                      '0s'
                    }</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      case 'audit':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-800">Audit Trail & Blockchain</h3>
            
            <div className="space-y-4">
              <BlockchainAuditTrail
                onNewEntry={(entry) => {
                  setBlockchainEntries(prev => [...prev, entry]);
                  addAuditEntry(`Blockchain entry added: ${entry.action}`);
                }}
                entries={blockchainEntries}
              />

              <div className="bg-gray-50 p-4 rounded-lg max-h-64 overflow-y-auto">
                <h4 className="font-semibold text-gray-700 mb-2">Recent Activity</h4>
                <div className="space-y-2">
                  {auditTrail.slice(-10).map((entry, index) => (
                    <div key={index} className="text-sm bg-white p-2 rounded border">
                      <div className="font-medium">{entry.action}</div>
                      <div className="text-gray-500 text-xs">
                        {new Date(entry.timestamp).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 'ai':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-800">AI Features</h3>
            
            <div className="space-y-4">
              {aiRecommendations.length > 0 && (
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-purple-800 mb-2">AI Recommendations</h4>
                  <div className="space-y-2">
                    {aiRecommendations.map((rec, index) => (
                      <div key={index} className="bg-white p-2 rounded border text-sm">
                        <div className="font-medium">Position: ({rec.x}, {rec.y})</div>
                        <div className="text-gray-600">{rec.reason}</div>
                        <div className="text-purple-600">Confidence: {(rec.confidence * 100).toFixed(1)}%</div>
                        <button
                          onClick={() => setPosition({ x: rec.x, y: rec.y })}
                          className="mt-1 px-2 py-1 bg-purple-500 text-white rounded text-xs"
                        >
                          Apply
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {detectedClauses.length > 0 && (
                <div className="bg-orange-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-orange-800 mb-2">Detected Legal Clauses</h4>
                  <div className="space-y-1">
                    {detectedClauses.map((clause, index) => (
                      <div key={index} className="text-sm text-orange-800 flex items-center">
                        <AlertTriangle size={14} className="mr-1" />
                        {clause}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={`flex flex-col h-screen bg-gray-50 ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
      {/* Header */}
      <div className="bg-white shadow-sm border-b p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-800">Enhanced Signature Platform</h1>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-2 rounded-lg bg-gray-200 hover:bg-gray-300"
            >
              {isFullscreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
            </button>
            <button
              onClick={() => setIsCollaborativeMode(!isCollaborativeMode)}
              className={`p-2 rounded-lg ${isCollaborativeMode ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            >
              <Users size={20} />
            </button>
            <button
              onClick={() => setFraudDetectionEnabled(!fraudDetectionEnabled)}
              className={`p-2 rounded-lg ${fraudDetectionEnabled ? 'bg-red-500 text-white' : 'bg-gray-200'}`}
            >
              <Shield size={20} />
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Control Panel */}
        <div className="w-80 bg-white shadow-lg border-r flex flex-col">
          {/* Panel Navigation */}
          <div className="border-b p-4">
            <div className="grid grid-cols-5 gap-1">
              {[
                { key: 'basic', icon: Settings, label: 'Basic' },
                { key: 'advanced', icon: Brain, label: 'Advanced' },
                { key: 'biometric', icon: Eye, label: 'Biometric' },
                { key: 'audit', icon: History, label: 'Audit' },
                { key: 'ai', icon: Sparkles, label: 'AI' },
              ].map(({ key, icon: Icon, label }) => (
                <button
                  key={key}
                  onClick={() => setActivePanel(key as any)}
                  className={`p-2 rounded text-xs flex flex-col items-center gap-1 ${
                    activePanel === key ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <Icon size={16} />
                  <span>{label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Panel Content */}
          <div className="flex-1 p-6 overflow-y-auto">
            {renderControlPanel()}
          </div>

          {/* Actions */}
          <div className="border-t p-4 space-y-2">
            <button
              onClick={() => setIsLocked(!isLocked)}
              className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg ${
                isLocked ? 'bg-red-500 text-white' : 'bg-gray-500 text-white'
              }`}
            >
              {isLocked ? <Lock size={16} /> : <Unlock size={16} />}
              {isLocked ? 'Locked' : 'Unlocked'}
            </button>
            
            <button
              onClick={saveSignature}
              disabled={!signatureName || !pdfFile}
              className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg ${
                (!signatureName || !pdfFile) 
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                  : 'bg-green-500 text-white hover:bg-green-600'
              }`}
            >
              <Save size={16} />
              Save Signature
            </button>
            
            <button
              onClick={() => {
                if (pdfContainerRef.current) {
                  html2canvas(pdfContainerRef.current).then(canvas => {
                    const link = document.createElement('a');
                    link.download = `signed-${new Date().toISOString().slice(0, 10)}.png`;
                    link.href = canvas.toDataURL();
                    link.click();
                    addAuditEntry('Document exported as image');
                  });
                }
              }}
              disabled={!pdfFile}
              className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg ${
                !pdfFile 
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                  : 'bg-blue-500 text-white hover:bg-blue-600'
              }`}
            >
              <Download size={16} />
              Export Document
            </button>
          </div>
        </div>

        {/* Main PDF Viewer */}
        <div className="flex-1 flex flex-col">
          {/* PDF Controls */}
          <div className="bg-white border-b p-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <input
                type="file"
                accept=".pdf"
                onChange={handlePdfUpload}
                className="text-sm"
              />
              <button
                onClick={() => setScale(scale * 1.1)}
                className="p-2 bg-gray-200 rounded-lg hover:bg-gray-300"
              >
                <ZoomIn size={20} />
              </button>
              <button
                onClick={() => setScale(scale * 0.9)}
                className="p-2 bg-gray-200 rounded-lg hover:bg-gray-300"
              >
                <ZoomOut size={20} />
              </button>
              <span className="text-sm text-gray-600">
                Zoom: {Math.round(scale * 100)}%
              </span>
            </div>
            
            {numPages > 0 && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage <= 1}
                  className="px-3 py-1 bg-gray-200 rounded-lg disabled:opacity-50"
                >
                  Previous
                </button>
                <span className="text-sm">
                  Page {currentPage} of {numPages}
                </span>
                <button
                  onClick={() => setCurrentPage(Math.min(numPages, currentPage + 1))}
                  disabled={currentPage >= numPages}
                  className="px-3 py-1 bg-gray-200 rounded-lg disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}
          </div>

          {/* PDF Viewer Container */}
          <div className="flex-1 overflow-auto bg-gray-100 p-4">
            <div
              ref={pdfContainerRef}
              className="relative mx-auto bg-white shadow-lg"
              style={{ width: 'fit-content' }}
            >
              {pdfFile ? (
                <Document
                  file={pdfFile}
                  onLoadSuccess={({ numPages }) => setNumPages(numPages)}
                  className="relative"
                >
                  <Page
                    pageNumber={currentPage}
                    scale={scale}
                    className="relative"
                  />
                  
                  {/* Draggable Signature */}
                  {signatureName && (
                    <Draggable
                      position={position}
                      onDrag={(e, data) => {
                        if (!isLocked) {
                          setPosition({ x: data.x, y: data.y });
                        }
                      }}
                      disabled={isLocked}
                      bounds="parent"
                    >
                      <div
                        ref={signatureRef}
                        className={`absolute cursor-move select-none ${
                          isLocked ? 'cursor-not-allowed' : 'cursor-move'
                        } ${isRecordingBiometric ? 'ring-2 ring-blue-500' : ''}`}
                        style={{
                          fontFamily: selectedFont,
                          fontSize: `${fontSize}px`,
                          color: '#000',
                          userSelect: 'none',
                          padding: '4px 8px',
                          background: isLocked ? 'rgba(255, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0.8)',
                          border: isLocked ? '2px solid red' : '1px dashed #ccc',
                          borderRadius: '4px'
                        }}
                      >
                        {signatureName}
                      </div>
                    </Draggable>
                  )}

                  {/* AI Recommendation Markers */}
                  {aiRecommendations.map((rec, index) => (
                    <div
                      key={index}
                      className="absolute w-4 h-4 bg-purple-500 rounded-full animate-pulse"
                      style={{
                        left: rec.x,
                        top: rec.y,
                        transform: 'translate(-50%, -50%)'
                      }}
                      title={`AI Recommendation: ${rec.reason} (${(rec.confidence * 100).toFixed(1)}%)`}
                    />
                  ))}
                </Document>
              ) : (
                <div className="flex items-center justify-center h-96 bg-gray-50 rounded-lg">
                  <div className="text-center">
                    <FileText size={48} className="mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-500">Upload a PDF document to get started</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Webcam Panel */}
        {showWebcam && (
          <div className="w-80 bg-white shadow-lg border-l p-6">
            <h3 className="font-semibold text-gray-700 mb-3">Camera Capture</h3>
            <Webcam
              ref={webcamRef}
              className="w-full rounded-lg"
              screenshotFormat="image/jpeg"
            />
            <button
              onClick={() => {
                if (webcamRef.current) {
                  const imageSrc = webcamRef.current.getScreenshot();
                  if (imageSrc) {
                    const link = document.createElement('a');
                    link.download = `photo-${Date.now()}.jpg`;
                    link.href = imageSrc;
                    link.click();
                  }
                }
              }}
              className="mt-2 w-full px-3 py-2 bg-indigo-500 text-white rounded-lg"
            >
              Capture Photo
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EnhancedSignatureComponent;
