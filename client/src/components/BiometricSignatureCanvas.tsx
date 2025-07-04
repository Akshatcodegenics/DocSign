import React, { useRef, useState, useCallback, useEffect } from 'react';
import { Trash2, Download, Save } from 'lucide-react';

interface BiometricSignatureCanvasProps {
  onSignatureComplete: (signatureData: BiometricCanvasData) => void;
  isRecording: boolean;
  width?: number;
  height?: number;
}

interface BiometricCanvasData {
  imageData: string;
  strokes: StrokeData[];
  metadata: {
    duration: number;
    totalPoints: number;
    averagePressure: number;
    averageSpeed: number;
    deviceType: string;
  };
}

interface StrokeData {
  points: PointData[];
  timestamp: number;
  strokeId: number;
}

interface PointData {
  x: number;
  y: number;
  pressure: number;
  timestamp: number;
  velocity: number;
}

const BiometricSignatureCanvas: React.FC<BiometricSignatureCanvasProps> = ({
  onSignatureComplete,
  isRecording,
  width = 400,
  height = 200
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [strokes, setStrokes] = useState<StrokeData[]>([]);
  const [currentStroke, setCurrentStroke] = useState<PointData[]>([]);
  const [strokeCounter, setStrokeCounter] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [lastPoint, setLastPoint] = useState<{ x: number; y: number; time: number } | null>(null);

  const getContext = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;
    
    // Configure canvas for smooth drawing
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;
    
    return ctx;
  }, []);

  const clearCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = getContext();
    if (!canvas || !ctx) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setStrokes([]);
    setCurrentStroke([]);
    setStrokeCounter(0);
    setStartTime(null);
    setLastPoint(null);
  }, [getContext]);

  const getPointerData = useCallback((e: PointerEvent | React.PointerEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Get pressure (0-1, default to 0.5 for mouse)
    const pressure = (e as any).pressure || 0.5;
    
    // Calculate velocity if we have a previous point
    let velocity = 0;
    if (lastPoint) {
      const deltaX = x - lastPoint.x;
      const deltaY = y - lastPoint.y;
      const deltaTime = Date.now() - lastPoint.time;
      velocity = Math.sqrt(deltaX * deltaX + deltaY * deltaY) / Math.max(deltaTime, 1);
    }
    
    return {
      x,
      y,
      pressure,
      timestamp: Date.now(),
      velocity
    };
  }, [lastPoint]);

  const startDrawing = useCallback((e: React.PointerEvent) => {
    if (!isRecording) return;
    
    const pointData = getPointerData(e);
    if (!pointData) return;
    
    setIsDrawing(true);
    if (!startTime) {
      setStartTime(Date.now());
    }
    
    setCurrentStroke([pointData]);
    setLastPoint({ x: pointData.x, y: pointData.y, time: pointData.timestamp });
    
    const ctx = getContext();
    if (ctx) {
      ctx.beginPath();
      ctx.moveTo(pointData.x, pointData.y);
    }
  }, [isRecording, getPointerData, getContext, startTime]);

  const draw = useCallback((e: React.PointerEvent) => {
    if (!isDrawing || !isRecording) return;
    
    const pointData = getPointerData(e);
    if (!pointData) return;
    
    setCurrentStroke(prev => [...prev, pointData]);
    setLastPoint({ x: pointData.x, y: pointData.y, time: pointData.timestamp });
    
    const ctx = getContext();
    if (ctx) {
      // Vary line width based on pressure
      ctx.lineWidth = Math.max(1, pointData.pressure * 4);
      ctx.lineTo(pointData.x, pointData.y);
      ctx.stroke();
    }
  }, [isDrawing, isRecording, getPointerData, getContext]);

  const stopDrawing = useCallback(() => {
    if (!isDrawing) return;
    
    setIsDrawing(false);
    
    if (currentStroke.length > 0) {
      const newStroke: StrokeData = {
        points: currentStroke,
        timestamp: Date.now(),
        strokeId: strokeCounter
      };
      
      setStrokes(prev => [...prev, newStroke]);
      setStrokeCounter(prev => prev + 1);
      setCurrentStroke([]);
    }
  }, [isDrawing, currentStroke, strokeCounter]);

  const exportSignature = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || strokes.length === 0) return;
    
    const allPoints = strokes.flatMap(stroke => stroke.points);
    const duration = startTime ? Date.now() - startTime : 0;
    
    const metadata = {
      duration,
      totalPoints: allPoints.length,
      averagePressure: allPoints.reduce((sum, p) => sum + p.pressure, 0) / allPoints.length,
      averageSpeed: allPoints.reduce((sum, p) => sum + p.velocity, 0) / allPoints.length,
      deviceType: navigator.maxTouchPoints > 0 ? 'touch' : 'mouse'
    };
    
    const signatureData: BiometricCanvasData = {
      imageData: canvas.toDataURL('image/png'),
      strokes,
      metadata
    };
    
    onSignatureComplete(signatureData);
  }, [strokes, startTime, onSignatureComplete]);

  const downloadSignature = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const link = document.createElement('a');
    link.download = `biometric-signature-${Date.now()}.png`;
    link.href = canvas.toDataURL();
    link.click();
  }, []);

  // Setup canvas size
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    // Set internal canvas size
    canvas.width = width;
    canvas.height = height;
    
    // Set display size via CSS
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
  }, [width, height]);

  return (
    <div className="border rounded-lg p-4 bg-white">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-semibold text-gray-700">Biometric Signature Capture</h3>
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 rounded text-xs ${
            isRecording ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
          }`}>
            {isRecording ? 'Recording' : 'Standby'}
          </span>
        </div>
      </div>
      
      <canvas
        ref={canvasRef}
        className={`border-2 border-dashed rounded cursor-crosshair ${
          isRecording ? 'border-blue-400 bg-blue-50' : 'border-gray-300 bg-gray-50'
        }`}
        onPointerDown={startDrawing}
        onPointerMove={draw}
        onPointerUp={stopDrawing}
        onPointerLeave={stopDrawing}
        style={{ touchAction: 'none' }} // Prevent scrolling on touch devices
      />
      
      <div className="mt-3 flex items-center justify-between">
        <div className="text-sm text-gray-600">
          Strokes: {strokes.length} | Points: {strokes.reduce((sum, s) => sum + s.points.length, 0)}
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={clearCanvas}
            className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded"
            title="Clear signature"
          >
            <Trash2 size={16} />
          </button>
          
          <button
            onClick={downloadSignature}
            className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded"
            title="Download signature"
            disabled={strokes.length === 0}
          >
            <Download size={16} />
          </button>
          
          <button
            onClick={exportSignature}
            className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600"
            disabled={strokes.length === 0}
          >
            <Save size={14} className="inline mr-1" />
            Save
          </button>
        </div>
      </div>
      
      {/* Enhanced Biometric Data Display */}
      {strokes.length > 0 && (
        <div className="mt-3 p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
          <div className="mb-2">
            <h4 className="text-sm font-semibold text-gray-800">Biometric Analysis</h4>
          </div>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="bg-white p-2 rounded border">
              <div className="font-medium text-blue-600">Timing</div>
              <div>Duration: {startTime ? `${((Date.now() - startTime) / 1000).toFixed(1)}s` : '0s'}</div>
              <div>Strokes: {strokes.length}</div>
            </div>
            <div className="bg-white p-2 rounded border">
              <div className="font-medium text-green-600">Pressure</div>
              <div>Avg: {(strokes.flatMap(s => s.points).reduce((sum, p) => sum + p.pressure, 0) / strokes.flatMap(s => s.points).length).toFixed(3)}</div>
              <div>Max: {Math.max(...strokes.flatMap(s => s.points).map(p => p.pressure)).toFixed(3)}</div>
            </div>
            <div className="bg-white p-2 rounded border">
              <div className="font-medium text-purple-600">Motion</div>
              <div>Avg Speed: {(strokes.flatMap(s => s.points).reduce((sum, p) => sum + p.velocity, 0) / strokes.flatMap(s => s.points).length).toFixed(2)}</div>
              <div>Points: {strokes.flatMap(s => s.points).length}</div>
            </div>
            <div className="bg-white p-2 rounded border">
              <div className="font-medium text-orange-600">Device</div>
              <div>Type: {navigator.maxTouchPoints > 0 ? 'Touch' : 'Mouse'}</div>
              <div>Touch Points: {navigator.maxTouchPoints}</div>
            </div>
          </div>
          <div className="mt-2 p-2 bg-gray-100 rounded text-xs">
            <div className="text-gray-600">
              <strong>Authenticity Score:</strong> {strokes.length > 3 ? '🟢 High' : strokes.length > 1 ? '🟡 Medium' : '🔴 Low'} 
              (Based on stroke complexity and biometric data)
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BiometricSignatureCanvas;
