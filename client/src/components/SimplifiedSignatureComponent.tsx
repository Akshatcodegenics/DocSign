import React, { useState, useRef, useCallback, useEffect } from 'react';
import Draggable from 'react-draggable';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Document, Page, pdfjs } from 'react-pdf';
import mongodbService from '../services/mongodbService';
import { 
  Download, 
  Lock, 
  Unlock, 
  ZoomIn, 
  ZoomOut, 
  Save,
  FileText,
  Upload,
  Users,
  Eye,
  Trash2
} from 'lucide-react';

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

interface SignatureData {
  id?: string;
  name: string;
  font: string;
  fontSize: number;
  position: { x: number; y: number };
  page: number;
  locked: boolean;
  timestamp: string;
  userId?: string;
  documentName?: string;
  documentId?: string;
}

interface DrawnSignature {
  id: string;
  imageData: string;
  position: { x: number; y: number };
  page: number;
  locked: boolean;
  timestamp: string;
}

interface AuthorizedSigner {
  id: string;
  name: string;
  email: string;
  role: string;
  permissions: string[];
  addedAt: string;
}

interface AuditEntry {
  id: string;
  action: string;
  timestamp: string;
  userId: string;
  userName: string;
  documentName: string;
  details: string;
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

const SimplifiedSignatureComponent: React.FC = () => {
  // Core state
  const [signatureName, setSignatureName] = useState('');
  const [selectedFont, setSelectedFont] = useState(SIGNATURE_FONTS[2].value); // Pacifico default
  const [fontSize, setFontSize] = useState(24);
  const [position, setPosition] = useState({ x: 100, y: 100 });
  const [isLocked, setIsLocked] = useState(false);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [numPages, setNumPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [scale, setScale] = useState(1.0);
  const [signatureData, setSignatureData] = useState<SignatureData[]>([]);
  
  // Drawing canvas state
  const [isDrawing, setIsDrawing] = useState(false);
  const [showDrawingCanvas, setShowDrawingCanvas] = useState(false);
  const [drawnSignatures, setDrawnSignatures] = useState<DrawnSignature[]>([]);
  
  // Authorization state
  const [authorizedSigners, setAuthorizedSigners] = useState<AuthorizedSigner[]>([]);
  const [showAuthPanel, setShowAuthPanel] = useState(false);
  const [newSignerEmail, setNewSignerEmail] = useState('');
  const [newSignerName, setNewSignerName] = useState('');
  const [newSignerRole, setNewSignerRole] = useState('Signer');
  
  // Audit state
  const [auditEntries, setAuditEntries] = useState<AuditEntry[]>([]);
  const [showAuditPanel, setShowAuditPanel] = useState(false);
  
  // Canvas state
  const [lastPoint, setLastPoint] = useState<{ x: number; y: number } | null>(null);
  
  // Refs
  const pdfContainerRef = useRef<HTMLDivElement>(null);
  const drawingCanvasRef = useRef<HTMLCanvasElement>(null);
  const dragRef = useRef<HTMLDivElement>(null);

  // Load Google Fonts
  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Great+Vibes&family=Dancing+Script&family=Pacifico&family=Kaushan+Script&family=Satisfy&family=Allura&family=Alex+Brush&family=Amatic+SC&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
  }, []);

  // Add audit entry
  const addAuditEntry = useCallback((action: string, details: string = '') => {
    const entry: AuditEntry = {
      id: Date.now().toString(),
      action,
      timestamp: new Date().toISOString(),
      userId: 'current-user',
      userName: 'Current User',
      documentName: pdfFile?.name || 'Unknown Document',
      details
    };
    setAuditEntries(prev => [entry, ...prev]);
  }, [pdfFile?.name]);

  // Handle PDF file upload
  const handlePdfUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setPdfFile(file);
      setCurrentPage(1);
      addAuditEntry('PDF uploaded', `File: ${file.name}`);
    }
  }, [addAuditEntry]);

  // Handle signature drag
  const handleDrag = useCallback((e: any, data: any) => {
    if (!isLocked) {
      setPosition({ x: data.x, y: data.y });
    }
  }, [isLocked]);

  // Lock/unlock signature
  const toggleLock = useCallback(() => {
    const newLocked = !isLocked;
    setIsLocked(newLocked);
    addAuditEntry(`Signature ${newLocked ? 'locked' : 'unlocked'}`, `Position: (${Math.round(position.x)}, ${Math.round(position.y)})`);
  }, [isLocked, addAuditEntry, position]);

  // Save typed signature
  const saveTypedSignature = useCallback(async () => {
    if (!signatureName.trim()) {
      alert('Please enter your name for the signature');
      return;
    }

    const signature: SignatureData = {
      id: Date.now().toString(),
      name: signatureName,
      font: selectedFont,
      fontSize,
      position,
      page: currentPage,
      locked: isLocked,
      timestamp: new Date().toISOString(),
      documentName: pdfFile?.name,
      documentId: pdfFile?.name // Would be actual document ID in real app
    };

    setSignatureData(prev => [...prev, signature]);
    
    // Save to MongoDB
    try {
      await mongodbService.saveSignature(signature);
      addAuditEntry('Typed signature saved', `Name: ${signatureName}, Page: ${currentPage}`);
      alert('Signature saved successfully!');
    } catch (error) {
      console.error('Error saving signature:', error);
      addAuditEntry('Error saving signature', `Error: ${error}`);
    }
  }, [signatureName, selectedFont, fontSize, position, currentPage, isLocked, pdfFile?.name, addAuditEntry]);

  // Drawing canvas functions
  const startDrawing = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = drawingCanvasRef.current;
    if (!canvas) return;

    setIsDrawing(true);
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setLastPoint({ x, y });

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.beginPath();
      ctx.moveTo(x, y);
    }
  }, []);

  const draw = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !lastPoint) return;

    const canvas = drawingCanvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.lineWidth = 2;
      ctx.lineCap = 'round';
      ctx.strokeStyle = '#000';
      ctx.lineTo(x, y);
      ctx.stroke();
    }

    setLastPoint({ x, y });
  }, [isDrawing, lastPoint]);

  const stopDrawing = useCallback(() => {
    setIsDrawing(false);
    setLastPoint(null);
  }, []);

  const clearCanvas = useCallback(() => {
    const canvas = drawingCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }, []);

  const saveDrawnSignature = useCallback(() => {
    const canvas = drawingCanvasRef.current;
    if (!canvas) return;

    const imageData = canvas.toDataURL('image/png');
    const drawnSig: DrawnSignature = {
      id: Date.now().toString(),
      imageData,
      position: { x: 100, y: 100 },
      page: currentPage,
      locked: false,
      timestamp: new Date().toISOString()
    };

    setDrawnSignatures(prev => [...prev, drawnSig]);
    addAuditEntry('Hand-drawn signature saved', `Page: ${currentPage}`);
    setShowDrawingCanvas(false);
  }, [currentPage, addAuditEntry]);

  // Add authorized signer
  const addAuthorizedSigner = useCallback(() => {
    if (!newSignerEmail || !newSignerName) {
      alert('Please fill in all fields');
      return;
    }

    const signer: AuthorizedSigner = {
      id: Date.now().toString(),
      name: newSignerName,
      email: newSignerEmail,
      role: newSignerRole,
      permissions: ['sign', 'view'],
      addedAt: new Date().toISOString()
    };

    setAuthorizedSigners(prev => [...prev, signer]);
    addAuditEntry('Authorized signer added', `${newSignerName} (${newSignerEmail})`);
    
    setNewSignerEmail('');
    setNewSignerName('');
    setNewSignerRole('Signer');
  }, [newSignerEmail, newSignerName, newSignerRole, addAuditEntry]);

  // Export as image
  const exportAsImage = useCallback(async () => {
    if (pdfContainerRef.current) {
      const canvas = await html2canvas(pdfContainerRef.current);
      const link = document.createElement('a');
      link.download = `signed-document-${Date.now()}.png`;
      link.href = canvas.toDataURL();
      link.click();
      addAuditEntry('Document exported as image');
    }
  }, [addAuditEntry]);

  // Export as PDF - Full Document
  const exportAsPDF = useCallback(async () => {
    if (!pdfFile) {
      alert('Please upload a PDF document first');
      return;
    }

    try {
      const pdf = new jsPDF();
      
      // Export all pages
      for (let pageNum = 1; pageNum <= numPages; pageNum++) {
        // Create a temporary container for each page
        const tempContainer = document.createElement('div');
        tempContainer.style.position = 'absolute';
        tempContainer.style.left = '-9999px';
        tempContainer.style.top = '-9999px';
        document.body.appendChild(tempContainer);
        
        // Render the page
        const pageElement = document.createElement('div');
        pageElement.style.width = '210mm';
        pageElement.style.minHeight = '297mm';
        pageElement.style.backgroundColor = 'white';
        pageElement.style.position = 'relative';
        
        // Add page content (this would need to be enhanced based on your PDF rendering)
        pageElement.innerHTML = `
          <div style="padding: 20px; font-family: Arial, sans-serif;">
            <h2>Page ${pageNum} of ${numPages}</h2>
            <p>Document: ${pdfFile.name}</p>
            <div style="margin-top: 50px;">
              ${signatureData
                .filter(sig => sig.page === pageNum)
                .map(sig => `
                  <div style="position: absolute; left: ${sig.position.x}px; top: ${sig.position.y}px; font-family: ${sig.font}; font-size: ${sig.fontSize}px;">
                    ${sig.name}
                  </div>
                `).join('')}
            </div>
          </div>
        `;
        
        tempContainer.appendChild(pageElement);
        
        // Convert to canvas and add to PDF
        const canvas = await html2canvas(pageElement, {
          width: 794, // A4 width in pixels at 96 DPI
          height: 1123, // A4 height in pixels at 96 DPI
          scale: 2
        });
        
        const imgData = canvas.toDataURL('image/png');
        
        if (pageNum > 1) {
          pdf.addPage();
        }
        
        pdf.addImage(imgData, 'PNG', 0, 0, 210, 297);
        
        // Clean up
        document.body.removeChild(tempContainer);
      }
      
      pdf.save(`signed-document-complete-${Date.now()}.pdf`);
      addAuditEntry(`Complete PDF exported with ${numPages} pages`);
      
    } catch (error) {
      console.error('Error exporting PDF:', error);
      alert('Error exporting PDF. Falling back to current page export.');
      
      // Fallback to current page export
      if (pdfContainerRef.current) {
        const canvas = await html2canvas(pdfContainerRef.current);
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF();
        const imgWidth = 210;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
        pdf.save(`signed-document-page-${currentPage}-${Date.now()}.pdf`);
        addAuditEntry(`PDF exported (page ${currentPage} only)`);
      }
    }
  }, [pdfFile, numPages, signatureData, currentPage, addAuditEntry]);

  // Get export JSON
  const getExportJSON = useCallback(() => {
    const exportData = {
      typedSignatures: signatureData,
      drawnSignatures: drawnSignatures,
      currentPage,
      documentInfo: {
        name: pdfFile?.name,
        totalPages: numPages,
        scale
      },
      metadata: {
        timestamp: new Date().toISOString(),
        totalSignatures: signatureData.length + drawnSignatures.length
      }
    };
    
    console.log('Export JSON:', JSON.stringify(exportData, null, 2));
    return exportData;
  }, [signatureData, drawnSignatures, currentPage, pdfFile?.name, numPages, scale]);

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-800">PDF Signature Tool</h1>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAuthPanel(!showAuthPanel)}
              className={`p-2 rounded-lg ${showAuthPanel ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              title="Manage Authorized Signers"
            >
              <Users size={20} />
            </button>
            <button
              onClick={() => setShowAuditPanel(!showAuditPanel)}
              className={`p-2 rounded-lg ${showAuditPanel ? 'bg-green-500 text-white' : 'bg-gray-200'}`}
              title="View Audit Trail"
            >
              <Eye size={20} />
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
                <Upload size={16} className="inline mr-2" />
                Upload PDF Document
              </label>
              <input
                type="file"
                accept=".pdf"
                onChange={handlePdfUpload}
                className="w-full p-2 border border-gray-300 rounded-lg"
              />
              {pdfFile && (
                <p className="text-sm text-green-600 mt-1">
                  ✓ {pdfFile.name} loaded
                </p>
              )}
            </div>

            {/* Signature Options */}
            <div className="border-t pt-4">
              <h3 className="font-semibold text-gray-700 mb-3">Signature Options</h3>
              
              {/* Typed Signature */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type Your Name
                </label>
                <input
                  type="text"
                  value={signatureName}
                  onChange={(e) => setSignatureName(e.target.value)}
                  placeholder="Enter your full name"
                  className="w-full p-2 border border-gray-300 rounded-lg"
                />
                
                {/* Font Selection */}
                <div className="mt-2">
                  <label className="block text-sm text-gray-600 mb-1">Signature Font</label>
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
                <div className="mt-2">
                  <label className="block text-sm text-gray-600 mb-1">
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

                {/* Live Preview */}
                {signatureName && (
                  <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-600 mb-2">Live Preview:</div>
                    <div
                      style={{
                        fontFamily: selectedFont,
                        fontSize: `${fontSize}px`,
                        color: '#000',
                        textAlign: 'center'
                      }}
                    >
                      {signatureName}
                    </div>
                  </div>
                )}
              </div>

              {/* Draw Signature */}
              <div className="mb-4">
                <button
                  onClick={() => setShowDrawingCanvas(!showDrawingCanvas)}
                  className="w-full flex items-center gap-2 px-3 py-2 bg-purple-500 text-white rounded-lg"
                >
                  <FileText size={16} />
                  {showDrawingCanvas ? 'Hide Drawing Canvas' : 'Draw Signature'}
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
                  onClick={saveTypedSignature}
                  disabled={!signatureName.trim()}
                  className="flex items-center gap-2 px-3 py-2 bg-green-500 text-white rounded-lg disabled:opacity-50"
                >
                  <Save size={16} />
                  Save
                </button>
              </div>

              <div className="text-sm text-gray-600">
                Position: X: {Math.round(position.x)}, Y: {Math.round(position.y)}
              </div>
              <div className="text-sm text-gray-600">
                Page: {currentPage} of {numPages}
              </div>
            </div>

            {/* Export Options */}
            <div className="border-t pt-4">
              <h3 className="font-semibold text-gray-700 mb-3">Export Options</h3>
              
              <div className="space-y-2">
                <button
                  onClick={exportAsImage}
                  className="flex items-center gap-2 px-3 py-2 bg-blue-500 text-white rounded-lg w-full"
                >
                  <Download size={16} />
                  Export as Image
                </button>
                
                <button
                  onClick={exportAsPDF}
                  className="flex items-center gap-2 px-3 py-2 bg-red-500 text-white rounded-lg w-full"
                >
                  <Download size={16} />
                  Export as PDF
                </button>
                
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

            {/* Signature History */}
            {signatureData.length > 0 && (
              <div className="border-t pt-4">
                <h3 className="font-semibold text-gray-700 mb-3">Saved Signatures</h3>
                <div className="max-h-40 overflow-y-auto space-y-2">
                  {signatureData.map((sig, index) => (
                    <div key={index} className="p-2 bg-blue-50 rounded-lg text-sm">
                      <div className="font-medium">{sig.name}</div>
                      <div className="text-gray-500 text-xs">
                        Page {sig.page} | ({Math.round(sig.position.x)}, {Math.round(sig.position.y)})
                      </div>
                      <div className="text-gray-500 text-xs">
                        {new Date(sig.timestamp).toLocaleString()}
                      </div>
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
                disabled={!pdfFile}
              >
                <ZoomIn size={20} />
              </button>
              <button
                onClick={() => setScale(scale * 0.9)}
                className="p-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                disabled={!pdfFile}
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
                  
                  {/* Typed Signature Overlay */}
                  {signatureName && (
                    <Draggable
                      nodeRef={dragRef}
                      position={position}
                      onDrag={handleDrag}
                      disabled={isLocked}
                      bounds="parent"
                    >
                      <div
                        ref={dragRef}
                        className={`absolute select-none ${
                          isLocked ? 'cursor-not-allowed' : 'cursor-move'
                        }`}
                        style={{
                          fontFamily: selectedFont,
                          fontSize: `${fontSize}px`,
                          color: '#000',
                          userSelect: 'none',
                          padding: '4px 8px',
                          background: isLocked ? 'rgba(255, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0.8)',
                          border: isLocked ? '2px solid red' : '2px dashed #3B82F6',
                          borderRadius: '4px',
                          zIndex: 10
                        }}
                        title={`${signatureName} - ${isLocked ? 'Locked' : 'Drag to move'}`}
                      >
                        {signatureName}
                      </div>
                    </Draggable>
                  )}

                  {/* Drawn Signatures */}
                  {drawnSignatures
                    .filter(sig => sig.page === currentPage)
                    .map((sig) => (
                      <Draggable
                        key={sig.id}
                        position={sig.position}
                        disabled={sig.locked}
                        bounds="parent"
                        onDrag={(e, data) => {
                          if (!sig.locked) {
                            setDrawnSignatures(prev =>
                              prev.map(s =>
                                s.id === sig.id
                                  ? { ...s, position: { x: data.x, y: data.y } }
                                  : s
                              )
                            );
                          }
                        }}
                      >
                        <div
                          className={`absolute ${sig.locked ? 'cursor-not-allowed' : 'cursor-move'}`}
                          style={{
                            border: sig.locked ? '2px solid red' : '2px dashed #10B981',
                            borderRadius: '4px',
                            background: sig.locked ? 'rgba(255, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0.1)',
                            zIndex: 10
                          }}
                        >
                          <img
                            src={sig.imageData}
                            alt="Drawn signature"
                            style={{ maxWidth: '200px', maxHeight: '100px' }}
                          />
                        </div>
                      </Draggable>
                    ))}
                </Document>
              ) : (
                <div className="flex items-center justify-center h-96 bg-gray-50 rounded-lg">
                  <div className="text-center">
                    <FileText size={48} className="mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-500">Upload a PDF document to get started</p>
                    <p className="text-sm text-gray-400 mt-2">
                      Supported format: PDF files only
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Panel - Drawing Canvas / Authorization / Audit */}
        <div className="w-80 bg-white shadow-lg border-l p-6 overflow-y-auto">
          {/* Drawing Canvas */}
          {showDrawingCanvas && (
            <div className="mb-6">
              <h3 className="font-semibold text-gray-700 mb-3">Draw Your Signature</h3>
              <canvas
                ref={drawingCanvasRef}
                width={300}
                height={150}
                className="border-2 border-dashed border-gray-300 rounded-lg cursor-crosshair bg-white"
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
              />
              <div className="flex gap-2 mt-2">
                <button
                  onClick={clearCanvas}
                  className="flex items-center gap-1 px-2 py-1 bg-red-500 text-white rounded text-sm"
                >
                  <Trash2 size={14} />
                  Clear
                </button>
                <button
                  onClick={saveDrawnSignature}
                  className="flex items-center gap-1 px-2 py-1 bg-green-500 text-white rounded text-sm"
                >
                  <Save size={14} />
                  Save
                </button>
              </div>
            </div>
          )}

          {/* Authorization Panel */}
          {showAuthPanel && (
            <div className="mb-6">
              <h3 className="font-semibold text-gray-700 mb-3">Authorized Signers</h3>
              
              {/* Add New Signer */}
              <div className="space-y-2 mb-4">
                <input
                  type="text"
                  placeholder="Signer Name"
                  value={newSignerName}
                  onChange={(e) => setNewSignerName(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded text-sm"
                />
                <input
                  type="email"
                  placeholder="Email Address"
                  value={newSignerEmail}
                  onChange={(e) => setNewSignerEmail(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded text-sm"
                />
                <select
                  value={newSignerRole}
                  onChange={(e) => setNewSignerRole(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded text-sm"
                >
                  <option value="Signer">Signer</option>
                  <option value="Approver">Approver</option>
                  <option value="Witness">Witness</option>
                  <option value="Admin">Admin</option>
                </select>
                <button
                  onClick={addAuthorizedSigner}
                  className="w-full px-3 py-2 bg-blue-500 text-white rounded text-sm"
                >
                  Add Authorized Signer
                </button>
              </div>

              {/* Authorized Signers List */}
              <div className="max-h-60 overflow-y-auto space-y-2">
                {authorizedSigners.map((signer) => (
                  <div key={signer.id} className="p-2 bg-blue-50 rounded text-sm">
                    <div className="font-medium">{signer.name}</div>
                    <div className="text-gray-600 text-xs">{signer.email}</div>
                    <div className="text-blue-600 text-xs">{signer.role}</div>
                    <div className="text-gray-500 text-xs">
                      Added: {new Date(signer.addedAt).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Audit Panel */}
          {showAuditPanel && (
            <div className="mb-6">
              <h3 className="font-semibold text-gray-700 mb-3">Audit Trail</h3>
              <div className="max-h-96 overflow-y-auto space-y-2">
                {auditEntries.map((entry) => (
                  <div key={entry.id} className="p-2 bg-gray-50 rounded text-sm">
                    <div className="font-medium">{entry.action}</div>
                    <div className="text-gray-600 text-xs">{entry.details}</div>
                    <div className="text-gray-500 text-xs">
                      {new Date(entry.timestamp).toLocaleString()}
                    </div>
                    <div className="text-blue-600 text-xs">
                      by {entry.userName}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Drawn Signatures List */}
          {drawnSignatures.length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold text-gray-700 mb-3">Drawn Signatures</h3>
              <div className="max-h-40 overflow-y-auto space-y-2">
                {drawnSignatures.map((sig) => (
                  <div key={sig.id} className="p-2 bg-green-50 rounded text-sm">
                    <img
                      src={sig.imageData}
                      alt="Signature preview"
                      className="w-full h-8 object-contain mb-1"
                    />
                    <div className="text-gray-500 text-xs">
                      Page {sig.page} | ({Math.round(sig.position.x)}, {Math.round(sig.position.y)})
                    </div>
                    <div className="text-gray-500 text-xs">
                      {new Date(sig.timestamp).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SimplifiedSignatureComponent;
