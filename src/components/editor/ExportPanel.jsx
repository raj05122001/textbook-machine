'use client';

import { useState } from 'react';
import { 
  Download, 
  FileText, 
  File, 
  Book, 
  Globe, 
  Printer, 
  Settings, 
  Check, 
  X, 
  Clock, 
  AlertCircle,
  ChevronDown,
  ChevronRight,
  Eye,
  Share2,
  Cloud
} from 'lucide-react';

const ExportPanel = ({ 
  book = {}, 
  chapters = [], 
  onExport, 
  onPreview, 
  exportHistory = [],
  isExporting = false,
  className = '' 
}) => {
  const [selectedFormat, setSelectedFormat] = useState('pdf');
  const [selectedChapters, setSelectedChapters] = useState(chapters.map(c => c.id));
  const [exportSettings, setExportSettings] = useState({
    includeTableOfContents: true,
    includeCoverPage: true,
    includePageNumbers: true,
    includeSummaries: true,
    includeQuestions: true,
    includeReferences: true,
    watermark: false,
    customStyles: false,
    fontSize: 'medium',
    pageSize: 'A4',
    orientation: 'portrait',
    margins: 'normal'
  });
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  const exportFormats = [
    {
      id: 'pdf',
      name: 'PDF',
      description: 'Perfect for sharing and printing',
      icon: FileText,
      features: ['Professional layout', 'Print-ready', 'Universal compatibility'],
      recommended: true
    },
    {
      id: 'docx',
      name: 'Word Document',
      description: 'Editable format for further modifications',
      icon: File,
      features: ['Editable content', 'Track changes', 'Comments support']
    },
    {
      id: 'epub',
      name: 'EPUB',
      description: 'Digital book format for e-readers',
      icon: Book,
      features: ['Responsive layout', 'Adjustable font size', 'Bookmark support']
    },
    {
      id: 'html',
      name: 'HTML',
      description: 'Web-friendly format with interactive features',
      icon: Globe,
      features: ['Interactive elements', 'Search functionality', 'Mobile responsive']
    }
  ];

  const handleChapterToggle = (chapterId) => {
    setSelectedChapters(prev => 
      prev.includes(chapterId) 
        ? prev.filter(id => id !== chapterId)
        : [...prev, chapterId]
    );
  };

  const handleSelectAll = () => {
    setSelectedChapters(chapters.map(c => c.id));
  };

  const handleSelectNone = () => {
    setSelectedChapters([]);
  };

  const handleExport = () => {
    const exportConfig = {
      format: selectedFormat,
      chapters: selectedChapters,
      settings: exportSettings,
      timestamp: new Date().toISOString()
    };
    onExport?.(exportConfig);
  };

  const handlePreview = () => {
    const previewConfig = {
      format: selectedFormat,
      chapters: selectedChapters,
      settings: exportSettings
    };
    onPreview?.(previewConfig);
  };

  const getEstimatedSize = () => {
    const selectedChapterCount = selectedChapters.length;
    const totalWords = chapters
      .filter(c => selectedChapters.includes(c.id))
      .reduce((sum, c) => sum + (c.wordCount || 0), 0);
    
    const estimatedPages = Math.ceil(totalWords / 250);
    
    switch (selectedFormat) {
      case 'pdf':
        return `~${Math.ceil(estimatedPages * 0.5)}MB`;
      case 'docx':
        return `~${Math.ceil(estimatedPages * 0.2)}MB`;
      case 'epub':
        return `~${Math.ceil(estimatedPages * 0.1)}MB`;
      case 'html':
        return `~${Math.ceil(estimatedPages * 0.3)}MB`;
      default:
        return 'Unknown';
    }
  };

  const getEstimatedTime = () => {
    const selectedChapterCount = selectedChapters.length;
    const baseTime = selectedChapterCount * 2; // 2 seconds per chapter
    
    switch (selectedFormat) {
      case 'pdf':
        return `${Math.max(baseTime, 10)}s`;
      case 'docx':
        return `${Math.max(baseTime * 0.7, 5)}s`;
      case 'epub':
        return `${Math.max(baseTime * 1.2, 8)}s`;
      case 'html':
        return `${Math.max(baseTime * 0.5, 3)}s`;
      default:
        return 'Unknown';
    }
  };

  return (
    <div className={`bg-white rounded-lg shadow-lg ${className}`}>
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Export Book</h2>
            <p className="text-gray-600 mt-1">Choose format and customize your export</p>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <Clock className="h-4 w-4 mr-2 inline" />
              History
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
        {/* Format Selection */}
        <div className="lg:col-span-2 space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Export Format</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {exportFormats.map((format) => {
                const Icon = format.icon;
                return (
                  <div
                    key={format.id}
                    onClick={() => setSelectedFormat(format.id)}
                    className={`relative p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      selectedFormat === format.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {format.recommended && (
                      <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                        Recommended
                      </div>
                    )}
                    
                    <div className="flex items-start space-x-3">
                      <Icon className={`h-6 w-6 mt-1 ${
                        selectedFormat === format.id ? 'text-blue-600' : 'text-gray-600'
                      }`} />
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{format.name}</h4>
                        <p className="text-sm text-gray-600 mt-1">{format.description}</p>
                        <ul className="mt-2 space-y-1">
                          {format.features.map((feature, index) => (
                            <li key={index} className="text-xs text-gray-500 flex items-center">
                              <Check className="h-3 w-3 text-green-500 mr-1" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Chapter Selection */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Select Chapters</h3>
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleSelectAll}
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  Select All
                </button>
                <span className="text-gray-300">|</span>
                <button
                  onClick={handleSelectNone}
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  Select None
                </button>
              </div>
            </div>
            
            <div className="max-h-64 overflow-y-auto border border-gray-200 rounded-lg">
              {chapters.map((chapter) => (
                <div
                  key={chapter.id}
                  className="flex items-center space-x-3 p-3 border-b border-gray-100 last:border-b-0"
                >
                  <input
                    type="checkbox"
                    checked={selectedChapters.includes(chapter.id)}
                    onChange={() => handleChapterToggle(chapter.id)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-gray-900 truncate">
                      {chapter.title}
                    </h4>
                    <p className="text-xs text-gray-500">
                      {chapter.wordCount || 0} words • {Math.ceil((chapter.wordCount || 0) / 250)} pages
                    </p>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs ${
                    chapter.status === 'complete' ? 'bg-green-100 text-green-600' :
                    chapter.status === 'draft' ? 'bg-yellow-100 text-yellow-600' :
                    'bg-gray-100 text-gray-600'
                  }`}>
                    {chapter.status || 'draft'}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Advanced Settings */}
          <div>
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex items-center space-x-2 text-lg font-semibold text-gray-900 hover:text-gray-700"
            >
              {showAdvanced ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
              <span>Advanced Settings</span>
            </button>
            
            {showAdvanced && (
              <div className="mt-4 space-y-4 p-4 bg-gray-50 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Content Options */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Content Options</h4>
                    <div className="space-y-2">
                      {[
                        { key: 'includeTableOfContents', label: 'Table of Contents' },
                        { key: 'includeCoverPage', label: 'Cover Page' },
                        { key: 'includePageNumbers', label: 'Page Numbers' },
                        { key: 'includeSummaries', label: 'Chapter Summaries' },
                        { key: 'includeQuestions', label: 'Q&A Sections' },
                        { key: 'includeReferences', label: 'References' }
                      ].map((option) => (
                        <label key={option.key} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={exportSettings[option.key]}
                            onChange={(e) => setExportSettings(prev => ({
                              ...prev,
                              [option.key]: e.target.checked
                            }))}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <span className="text-sm text-gray-700">{option.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Layout Options */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Layout Options</h4>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm text-gray-700 mb-1">Font Size</label>
                        <select
                          value={exportSettings.fontSize}
                          onChange={(e) => setExportSettings(prev => ({
                            ...prev,
                            fontSize: e.target.value
                          }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="small">Small</option>
                          <option value="medium">Medium</option>
                          <option value="large">Large</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm text-gray-700 mb-1">Page Size</label>
                        <select
                          value={exportSettings.pageSize}
                          onChange={(e) => setExportSettings(prev => ({
                            ...prev,
                            pageSize: e.target.value
                          }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="A4">A4</option>
                          <option value="Letter">Letter</option>
                          <option value="Legal">Legal</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Export Summary & Actions */}
        <div className="space-y-6">
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-3">Export Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Format:</span>
                <span className="font-medium">{exportFormats.find(f => f.id === selectedFormat)?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Chapters:</span>
                <span className="font-medium">{selectedChapters.length}/{chapters.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Estimated Size:</span>
                <span className="font-medium">{getEstimatedSize()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Processing Time:</span>
                <span className="font-medium">{getEstimatedTime()}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={handlePreview}
              disabled={selectedChapters.length === 0}
              className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Eye className="h-4 w-4" />
              <span>Preview Export</span>
            </button>
            
            <button
              onClick={handleExport}
              disabled={selectedChapters.length === 0 || isExporting}
              className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isExporting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Exporting...</span>
                </>
              ) : (
                <>
                  <Download className="h-4 w-4" />
                  <span>Export Book</span>
                </>
              )}
            </button>
          </div>

          {/* Export History */}
          {showHistory && exportHistory.length > 0 && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-3">Recent Exports</h3>
              <div className="space-y-2">
                {exportHistory.slice(0, 5).map((export_, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-white rounded border">
                    <div className="flex items-center space-x-2">
                      <FileText className="h-4 w-4 text-gray-500" />
                      <div>
                        <div className="text-sm font-medium">{export_.format.toUpperCase()}</div>
                        <div className="text-xs text-gray-500">
                          {new Date(export_.timestamp).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <button className="text-blue-600 hover:text-blue-700 text-xs">
                      Download
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Warnings */}
          {selectedChapters.some(id => {
            const chapter = chapters.find(c => c.id === id);
            return chapter?.status === 'draft';
          }) && (
            <div className="flex items-start space-x-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5" />
              <div>
                <p className="text-sm text-yellow-800 font-medium">Draft Content Warning</p>
                <p className="text-xs text-yellow-700 mt-1">
                  Some selected chapters are still in draft status and may contain incomplete content.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExportPanel;