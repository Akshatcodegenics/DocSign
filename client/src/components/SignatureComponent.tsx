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
  FileText
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

const SignatureComponent: React.FC = () => {
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
      ipAddress: 'xxx.xxx.xxx.xxx', // Would get from API
      userAgent: navigator.userAgent,
      geolocation: { lat: 0, lng: 0 } // Would get from geolocation API
    };
    setAuditTrail(prev => [...prev, entry]);
  }, []);

  // AI-powered signature placement recommendation
  const generateAIRecommendations = useCallback(async () => {
    if (!pdfFile) return;
    
    // Simulate AI analysis of document content
    const recommendations: AIRecommendation[] = [
      { x: 400, y: 700, confidence: 0.95, reason: 'Found "Signature:" label' },
      { x: 300, y: 650, confidence: 0.8, reason: 'Bottom of contract section' },
      { x: 450, y: 550, confidence: 0.7, reason: 'Near date field' }
    ];
    
    setAiRecommendations(recommendations);
    addAuditEntry('AI recommendations generated');
  }, [pdfFile, addAuditEntry]);

  // Auto-generate signature initials
  const generateAISignature = useCallback(() => {
    if (!signatureName) return;
    
    const initials = signatureName.split(' ').map(word => word[0]).join('');
    const stylizedSignature = `${initials} ${signatureName}`;
    setSignatureName(stylizedSignature);
    addAuditEntry('AI signature generated');
  }, [signatureName, addAuditEntry]);

  // Biometric signature capture
  const startBiometricCapture = useCallback(() => {
    setIsRecordingBiometric(true);
    setBiometricData({
      pressure: [],
      speed: [],
      strokeOrder: [],
      timing: [],
      deviceType: navigator.maxTouchPoints > 0 ? 'touch' : 'mouse'
    });
    addAuditEntry('Biometric capture started');
  }, [addAuditEntry]);

  const stopBiometricCapture = useCallback(() => {
    setIsRecordingBiometric(false);
    addAuditEntry('Biometric capture stopped');
  }, [addAuditEntry]);

  // Voice verification
  const startVoiceRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      
      const chunks: Blob[] = [];
      mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/wav' });
        const reader = new FileReader();
        reader.onload = () => {
          setVoiceData(reader.result as string);
        };
        reader.readAsDataURL(blob);
      };
      
      mediaRecorder.start();
      setIsRecordingVoice(true);
      addAuditEntry('Voice recording started');
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  }, [addAuditEntry]);

  const stopVoiceRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecordingVoice) {
      mediaRecorderRef.current.stop();
      setIsRecordingVoice(false);
      addAuditEntry('Voice recording stopped');
    }
  }, [isRecordingVoice, addAuditEntry]);

  // Fraud detection
  const detectFraud = useCallback((newSignature: string) => {
    if (!fraudDetectionEnabled) return false;
    
    const previousSignatures = signatureData.map(s => s.name);
    // Simple fraud detection based on signature pattern changes
    const suspiciousActivity = previousSignatures.length > 0 && 
      !previousSignatures.some(prev => 
        prev.toLowerCase().includes(newSignature.toLowerCase().substring(0, 3))
      );
    
    if (suspiciousActivity) {
      addAuditEntry('Suspicious signature activity detected');
      alert('Fraud detection: Signature pattern differs significantly from previous signatures');
      return true;
    }
    return false;
  }, [signatureData, fraudDetectionEnabled, addAuditEntry]);

  // Legal clause detection
  const detectLegalClauses = useCallback(async () => {
    if (!pdfFile) return;
    
    // Simulate AI clause detection
    const clauses = [
      'Termination clause found on page 2',
      'Indemnity clause found on page 3',
      'Penalty clause found on page 4',
      'Confidentiality clause found on page 1'
    ];
    
    setDetectedClauses(clauses);
    addAuditEntry('Legal clauses detected');
  }, [pdfFile, addAuditEntry]);

  // Handle signature drag
  const handleDrag = useCallback((e: any, data: any) => {
    if (!isLocked) {
      setPosition({ x: data.x, y: data.y });
      if (isRecordingBiometric) {
        setBiometricData(prev => ({
          ...prev,
          speed: [...prev.speed, Math.sqrt(data.deltaX ** 2 + data.deltaY ** 2)],
          timing: [...prev.timing, Date.now()]
        }));
      }
    }
  }, [isLocked, isRecordingBiometric]);

  // Handle PDF file upload
  const handlePdfUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setPdfFile(file);
      addAuditEntry('PDF uploaded');
    }
  }, [addAuditEntry]);

  // Lock/unlock signature
  const toggleLock = useCallback(() => {
    setIsLocked(!isLocked);
    addAuditEntry(`Signature ${isLocked ? 'unlocked' : 'locked'}`);
  }, [isLocked, addAuditEntry]);

  // Save signature data
  const saveSignature = useCallback(async () => {
    if (detectFraud(signatureName)) return;
    
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
    
// Save to MongoDB
    try {
      await mongodbService.saveSignature(signature);
      addAuditEntry('Signature saved to MongoDB');
    } catch (error) {
      console.error('Error saving to MongoDB:', error);
    }

    addAuditEntry('Signature saved');
  }, [
    signatureName, selectedFont, fontSize, position, currentPage, 
    isLocked, biometricData, voiceData, auditTrail, addAuditEntry, detectFraud
  ]);

  // Export as image with format options
  const exportAsImage = useCallback(async (format: 'png' | 'jpeg' | 'webp' = 'png') => {
    if (signatureRef.current) {
      const canvas = await html2canvas(signatureRef.current, {
        backgroundColor: '#ffffff',
        scale: 2, // Higher quality
        useCORS: true
      });
      
      const mimeType = `image/${format}`;
      const quality = format === 'jpeg' ? 0.95 : undefined;
      const dataURL = canvas.toDataURL(mimeType, quality);
      
      const link = document.createElement('a');
      link.download = `signature-${Date.now()}.${format}`;
      link.href = dataURL;
      link.click();
      addAuditEntry(`Signature exported as ${format.toUpperCase()}`);
    }
  }, [addAuditEntry]);

  // Export document as image with format options
  const exportDocumentAsImage = useCallback(async (format: 'png' | 'jpeg' | 'webp' = 'png') => {
    if (pdfContainerRef.current) {
      const canvas = await html2canvas(pdfContainerRef.current, {
        backgroundColor: '#ffffff',
        scale: 2, // Higher quality
        useCORS: true,
        allowTaint: true
      });
      
      const mimeType = `image/${format}`;
      const quality = format === 'jpeg' ? 0.95 : undefined;
      const dataURL = canvas.toDataURL(mimeType, quality);
      
      const link = document.createElement('a');
      link.download = `signed-document-${Date.now()}.${format}`;
      link.href = dataURL;
      link.click();
      addAuditEntry(`Document exported as ${format.toUpperCase()}`);
    }
  }, [addAuditEntry]);

  // Export as PDF
  const exportAsPDF = useCallback(async () => {
    if (pdfContainerRef.current) {
      const canvas = await html2canvas(pdfContainerRef.current);
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF();
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`signed-document-${Date.now()}.pdf`);
      addAuditEntry('Document exported as PDF');
    }
  }, [addAuditEntry]);

  // Get export JSON
  const getExportJSON = useCallback(() => {
    const exportData = {
      signatures: signatureData,
      currentSignature: {
        name: signatureName,
        font: selectedFont,
        fontSize,
        position,
        page: currentPage,
        locked: isLocked
      },
      auditTrail,
      biometricData,
      voiceData,
      aiRecommendations,
      detectedClauses,
      documentVersion,
      metadata: {
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        documentHash: 'placeholder-hash' // Would calculate actual hash
      }
    };
    
    console.log('Export JSON:', JSON.stringify(exportData, null, 2));
    return exportData;
  }, [
    signatureData, signatureName, selectedFont, fontSize, position, 
    currentPage, isLocked, auditTrail, biometricData, voiceData, 
    aiRecommendations, detectedClauses, documentVersion
  ]);

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-800">Advanced Signature Platform</h1>
          <div className="flex items-center gap-2">
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
        {/* Left Panel - Controls */}
        <div className="w-80 bg-white shadow-lg border-r p-6 overflow-y-auto">
          <div className="space-y-6">
            {/* PDF Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload PDF Document
              </label>
              <input
                type="file"
                accept=".pdf"
                onChange={handlePdfUpload}
                className="w-full p-2 border border-gray-300 rounded-lg"
              />
            </div>

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
                className="w-full p-2 border border-gray-300 rounded-lg"
              />
              <button
                onClick={generateAISignature}
                className="mt-2 flex items-center gap-2 px-3 py-1 bg-purple-500 text-white rounded-lg text-sm"
              >
                <Brain size={16} />
                AI Generate
              </button>
            </div>

            {/* Font Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Signature Font
              </label>
              <select
                value={selectedFont}
                onChange={(e) => setSelectedFont(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg"
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

            {/* Advanced Features */}
            <div className="border-t pt-4">
              <h3 className="font-semibold text-gray-700 mb-3">Advanced Features</h3>
              
              {/* Biometric Capture */}
              <div className="mb-3">
                <button
                  onClick={isRecordingBiometric ? stopBiometricCapture : startBiometricCapture}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg w-full ${
                    isRecordingBiometric ? 'bg-red-500 text-white' : 'bg-blue-500 text-white'
                  }`}
                >
                  <Eye size={16} />
                  {isRecordingBiometric ? 'Stop Biometric' : 'Start Biometric Capture'}
                </button>
              </div>

              {/* Voice Recording */}
              <div className="mb-3">
                <button
                  onClick={isRecordingVoice ? stopVoiceRecording : startVoiceRecording}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg w-full ${
                    isRecordingVoice ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
                  }`}
                >
                  <Mic size={16} />
                  {isRecordingVoice ? 'Stop Voice Recording' : 'Start Voice Verification'}
                </button>
              </div>

              {/* AI Recommendations */}
              <div className="mb-3">
                <button
                  onClick={generateAIRecommendations}
                  className="flex items-center gap-2 px-3 py-2 bg-purple-500 text-white rounded-lg w-full"
                >
                  <Brain size={16} />
                  Get AI Placement Suggestions
                </button>
              </div>

              {/* Legal Clause Detection */}
              <div className="mb-3">
                <button
                  onClick={detectLegalClauses}
                  className="flex items-center gap-2 px-3 py-2 bg-orange-500 text-white rounded-lg w-full"
                >
                  <FileText size={16} />
                  Detect Legal Clauses
                </button>
              </div>

              {/* Webcam Capture */}
              <div className="mb-3">
                <button
                  onClick={() => setShowWebcam(!showWebcam)}
                  className="flex items-center gap-2 px-3 py-2 bg-indigo-500 text-white rounded-lg w-full"
                >
                  <Camera size={16} />
                  {showWebcam ? 'Hide Camera' : 'Show Camera'}
                </button>
              </div>
            </div>

            {/* Position Controls */}
            <div className="border-t pt-4">
              <h3 className="font-semibold text-gray-700 mb-3">Position & Controls</h3>
              
              <div className="grid grid-cols-2 gap-2 mb-3">
                <button
                  onClick={toggleLock}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
                    isLocked ? 'bg-red-500 text-white' : 'bg-gray-500 text-white'
                  }`}
                >
                  {isLocked ? <Lock size={16} /> : <Unlock size={16} />}
                  {isLocked ? 'Locked' : 'Unlocked'}
                </button>
                
                <button
                  onClick={saveSignature}
                  className="flex items-center gap-2 px-3 py-2 bg-green-500 text-white rounded-lg"
                >
                  <Save size={16} />
                  Save
                </button>
              </div>

              <div className="text-sm text-gray-600">
                Position: X: {Math.round(position.x)}, Y: {Math.round(position.y)}
              </div>
            </div>

            {/* Export Options */}
            <div className="border-t pt-4">
              <h3 className="font-semibold text-gray-700 mb-3">Export Options</h3>
              
              <div className="space-y-3">
                {/* Export Signature as Image */}
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Export Signature</label>
                  <div className="flex gap-1">
                    <button
                      onClick={() => exportAsImage('png')}
                      className="flex-1 flex items-center justify-center gap-1 px-2 py-2 bg-blue-500 text-white rounded-lg text-xs"
                    >
                      <Download size={12} />
                      PNG
                    </button>
                    <button
                      onClick={() => exportAsImage('jpeg')}
                      className="flex-1 flex items-center justify-center gap-1 px-2 py-2 bg-blue-600 text-white rounded-lg text-xs"
                    >
                      <Download size={12} />
                      JPG
                    </button>
                    <button
                      onClick={() => exportAsImage('webp')}
                      className="flex-1 flex items-center justify-center gap-1 px-2 py-2 bg-blue-700 text-white rounded-lg text-xs"
                    >
                      <Download size={12} />
                      WebP
                    </button>
                  </div>
                </div>

                {/* Export Document as Image */}
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Export Document</label>
                  <div className="flex gap-1">
                    <button
                      onClick={() => exportDocumentAsImage('png')}
                      className="flex-1 flex items-center justify-center gap-1 px-2 py-2 bg-green-500 text-white rounded-lg text-xs"
                    >
                      <Download size={12} />
                      PNG
                    </button>
                    <button
                      onClick={() => exportDocumentAsImage('jpeg')}
                      className="flex-1 flex items-center justify-center gap-1 px-2 py-2 bg-green-600 text-white rounded-lg text-xs"
                    >
                      <Download size={12} />
                      JPG
                    </button>
                    <button
                      onClick={() => exportDocumentAsImage('webp')}
                      className="flex-1 flex items-center justify-center gap-1 px-2 py-2 bg-green-700 text-white rounded-lg text-xs"
                    >
                      <Download size={12} />
                      WebP
                    </button>
                  </div>
                </div>
                
                {/* Export as PDF */}
                <button
                  onClick={exportAsPDF}
                  className="flex items-center gap-2 px-3 py-2 bg-red-500 text-white rounded-lg w-full"
                >
                  <Download size={16} />
                  Export as PDF
                </button>
                
                {/* Export JSON Data */}
                <button
                  onClick={() => {
                    const json = getExportJSON();
                    const blob = new Blob([JSON.stringify(json, null, 2)], { type: 'application/json' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `signature-data-${Date.now()}.json`;
                    a.click();
                  }}
                  className="flex items-center gap-2 px-3 py-2 bg-gray-500 text-white rounded-lg w-full"
                >
                  <Download size={16} />
                  Export JSON Data
                </button>
              </div>
            </div>

            {/* AI Recommendations Display */}
            {aiRecommendations.length > 0 && (
              <div className="border-t pt-4">
                <h3 className="font-semibold text-gray-700 mb-3">AI Recommendations</h3>
                <div className="space-y-2">
                  {aiRecommendations.map((rec, index) => (
                    <div key={index} className="p-2 bg-purple-50 rounded-lg text-sm">
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

            {/* Detected Clauses */}
            {detectedClauses.length > 0 && (
              <div className="border-t pt-4">
                <h3 className="font-semibold text-gray-700 mb-3">Detected Legal Clauses</h3>
                <div className="space-y-1">
                  {detectedClauses.map((clause, index) => (
                    <div key={index} className="p-2 bg-orange-50 rounded-lg text-sm text-orange-800">
                      <AlertTriangle size={14} className="inline mr-1" />
                      {clause}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Main Content - PDF Viewer */}
        <div className="flex-1 flex flex-col">
          {/* PDF Controls */}
          <div className="bg-white border-b p-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
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
                      onDrag={handleDrag}
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

        {/* Right Panel - Additional Features */}
        <div className="w-80 bg-white shadow-lg border-l p-6 overflow-y-auto custom-scrollbar">
          {/* Biometric Canvas */}
          {showBiometricCanvas && (
            <div className="mb-6">
              <BiometricSignatureCanvas
                onSignatureComplete={(data) => {
                  console.log('Biometric signature completed:', data);
                  addAuditEntry('Biometric signature captured');
                }}
                isRecording={isRecordingBiometric}
              />
            </div>
          )}

          {/* Biometric Canvas Toggle */}
          <div className="mb-6">
            <button
              onClick={() => setShowBiometricCanvas(!showBiometricCanvas)}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg ${
                showBiometricCanvas ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
              }`}
            >
              <Eye size={16} />
              {showBiometricCanvas ? 'Hide Biometric Canvas' : 'Show Biometric Canvas'}
            </button>
          </div>

          {/* Blockchain Audit Trail */}
          <div className="mb-6">
            <BlockchainAuditTrail
              onNewEntry={(entry) => {
                setBlockchainEntries(prev => [...prev, entry]);
                addAuditEntry(`Blockchain entry added: ${entry.action}`);
              }}
              entries={blockchainEntries}
            />
          </div>

          {/* Webcam */}
          {showWebcam && (
            <div className="mb-6">
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

          {/* Audit Trail */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <History size={16} />
              Audit Trail
            </h3>
            <div className="max-h-48 overflow-y-auto space-y-2">
              {auditTrail.slice(-10).map((entry, index) => (
                <div key={index} className="p-2 bg-gray-50 rounded-lg text-sm">
                  <div className="font-medium">{entry.action}</div>
                  <div className="text-gray-500 text-xs">
                    {new Date(entry.timestamp).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Signature History */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-700 mb-3">Signature History</h3>
            <div className="max-h-48 overflow-y-auto space-y-2">
              {signatureData.map((sig, index) => (
                <div key={index} className="p-2 bg-blue-50 rounded-lg text-sm">
                  <div className="font-medium">{sig.name}</div>
                  <div className="text-gray-500 text-xs">
                    Page {sig.page} | ({sig.position.x}, {sig.position.y})
                  </div>
                  <div className="text-gray-500 text-xs">
                    {new Date(sig.timestamp).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Version Control */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-700 mb-3">Document Version</h3>
            <div className="flex items-center gap-2">
              <span className="text-sm">v{documentVersion}</span>
              <button
                onClick={() => setDocumentVersion(documentVersion + 1)}
                className="px-2 py-1 bg-blue-500 text-white rounded text-xs"
              >
                New Version
              </button>
            </div>
          </div>

          {/* Biometric Data Display */}
          {biometricData.pressure.length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold text-gray-700 mb-3">Biometric Data</h3>
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
    </div>
  );
};

export default SignatureComponent;
