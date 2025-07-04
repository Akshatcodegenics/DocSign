import React, { useState } from 'react';
import { Download, FileText, Image, Archive } from 'lucide-react';
import { exportService } from '../services/exportService';

interface ExportDemoProps {
  documentId?: string;
}

const ExportDemo: React.FC<ExportDemoProps> = ({ documentId = 'demo-doc-123' }) => {
  const [isExporting, setIsExporting] = useState(false);
  const [exportStatus, setExportStatus] = useState<string>('');

  const handleExport = async (format: string, type: 'document' | 'data') => {
    setIsExporting(true);
    setExportStatus(`Exporting as ${format.toUpperCase()}...`);

    try {
      if (type === 'document') {
        if (format === 'pdf') {
          const response = await exportService.exportAsPDF(documentId);
          const filename = exportService.generateFilename('document', 'pdf');
          exportService.downloadFile(response.data, filename, 'application/pdf');
        } else {
          const response = await exportService.exportAsImage(documentId, format as 'png' | 'jpeg' | 'webp');
          const filename = exportService.generateFilename('document', format);
          const mimeType = format === 'png' ? 'image/png' : format === 'jpeg' ? 'image/jpeg' : 'image/webp';
          exportService.downloadFile(response.data, filename, mimeType);
        }
      } else {
        if (format === 'json') {
          const data = await exportService.exportAsJSON(documentId);
          const filename = exportService.generateFilename('document', 'json');
          const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
          exportService.downloadFile(blob, filename, 'application/json');
        } else if (format === 'audit-json') {
          const data = await exportService.exportAuditTrail(documentId, 'json');
          const filename = exportService.generateFilename('document', 'audit_json');
          const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
          exportService.downloadFile(blob, filename, 'application/json');
        } else if (format === 'audit-csv') {
          const response = await exportService.exportAuditTrail(documentId, 'csv');
          const filename = exportService.generateFilename('document', 'audit_csv');
          exportService.downloadFile(response.data, filename, 'text/csv');
        }
      }

      setExportStatus(`✅ ${format.toUpperCase()} export completed!`);
      
      setTimeout(() => {
        setExportStatus('');
      }, 3000);
      
    } catch (error) {
      console.error('Export error:', error);
      setExportStatus(`❌ Export failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          🎉 Enhanced Export Functionality Available!
        </h2>
        <p className="text-gray-600">
          Your signature application now supports multiple export formats for both documents and data.
        </p>
      </div>

      {exportStatus && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-blue-800 font-medium">{exportStatus}</p>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-8">
        {/* Document Export */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <FileText size={20} />
            Export Signed Documents
          </h3>
          
          <div className="space-y-3">
            {/* PDF Export */}
            <button
              onClick={() => handleExport('pdf', 'document')}
              disabled={isExporting}
              className="w-full flex items-center gap-3 p-4 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download size={20} />
              <div className="text-left">
                <div className="font-semibold">Export as PDF</div>
                <div className="text-sm opacity-90">Original format with all signatures embedded</div>
              </div>
            </button>

            {/* Image Exports */}
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => handleExport('png', 'document')}
                disabled={isExporting}
                className="flex flex-col items-center gap-2 p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
              >
                <Image size={16} />
                <span className="text-xs font-medium">PNG</span>
              </button>
              
              <button
                onClick={() => handleExport('jpeg', 'document')}
                disabled={isExporting}
                className="flex flex-col items-center gap-2 p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                <Image size={16} />
                <span className="text-xs font-medium">JPEG</span>
              </button>
              
              <button
                onClick={() => handleExport('webp', 'document')}
                disabled={isExporting}
                className="flex flex-col items-center gap-2 p-3 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors disabled:opacity-50"
              >
                <Image size={16} />
                <span className="text-xs font-medium">WebP</span>
              </button>
            </div>
          </div>
        </div>

        {/* Data Export */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <Archive size={20} />
            Export Signature Data
          </h3>
          
          <div className="space-y-3">
            {/* JSON Export */}
            <button
              onClick={() => handleExport('json', 'data')}
              disabled={isExporting}
              className="w-full flex items-center gap-3 p-4 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50"
            >
              <Download size={20} />
              <div className="text-left">
                <div className="font-semibold">Export as JSON</div>
                <div className="text-sm opacity-90">Complete signature data and metadata</div>
              </div>
            </button>

            {/* Audit Trail Exports */}
            <button
              onClick={() => handleExport('audit-json', 'data')}
              disabled={isExporting}
              className="w-full flex items-center gap-3 p-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
            >
              <Download size={20} />
              <div className="text-left">
                <div className="font-semibold">Export Audit Trail (JSON)</div>
                <div className="text-sm opacity-90">Complete activity log and timeline</div>
              </div>
            </button>

            <button
              onClick={() => handleExport('audit-csv', 'data')}
              disabled={isExporting}
              className="w-full flex items-center gap-3 p-4 bg-green-700 text-white rounded-lg hover:bg-green-800 transition-colors disabled:opacity-50"
            >
              <Download size={20} />
              <div className="text-left">
                <div className="font-semibold">Export Audit Trail (CSV)</div>
                <div className="text-sm opacity-90">Spreadsheet-compatible format</div>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Features List */}
      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <h4 className="font-semibold text-gray-800 mb-3">✨ New Export Features:</h4>
        <ul className="space-y-2 text-sm text-gray-600">
          <li className="flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            Multiple image formats: PNG (lossless), JPEG (compressed), WebP (modern)
          </li>
          <li className="flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            High-quality PDF export with embedded signatures
          </li>
          <li className="flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            Complete signature data export in JSON format
          </li>
          <li className="flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            Comprehensive audit trail in JSON and CSV formats
          </li>
          <li className="flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            Server-side processing for optimal file quality
          </li>
          <li className="flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            Timestamped filenames for easy organization
          </li>
        </ul>
      </div>

      {/* API Information */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h4 className="font-semibold text-blue-800 mb-2">🔧 API Endpoints:</h4>
        <div className="text-sm text-blue-700 space-y-1 font-mono">
          <div>GET /api/export/formats - List all available formats</div>
          <div>GET /api/export/:id/pdf - Export as PDF</div>
          <div>GET /api/export/:id/image/:format - Export as image</div>
          <div>GET /api/export/:id/json - Export signature data</div>
          <div>GET /api/export/:id/audit - Export audit trail</div>
        </div>
      </div>
    </div>
  );
};

export default ExportDemo;
