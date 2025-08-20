'use client';

import { useState, useEffect, useRef } from 'react';
import { 
  Eye, 
  Monitor, 
  Smartphone, 
  Tablet, 
  Maximize2, 
  Minimize2, 
  RotateCw, 
  RefreshCw,
  Printer,
  Download,
  Settings,
  ZoomIn,
  ZoomOut,
  Layers
} from 'lucide-react';

const PreviewPanel = ({ 
  content = '', 
  title = 'Chapter Preview',
  description = '',
  chapters = [],
  activeChapterId = null,
  theme = 'light',
  onThemeChange,
  onExport,
  className = ''
}) => {
  const [viewMode, setViewMode] = useState('desktop'); // desktop, tablet, mobile
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [orientation, setOrientation] = useState('portrait'); // portrait, landscape
  const [zoom, setZoom] = useState(100);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  
  const previewRef = useRef(null);
  const contentRef = useRef(null);

  // Parse markdown content to HTML (basic implementation)
  const parseMarkdown = (markdown) => {
    if (!markdown) return '';
    
    return markdown
      // Headers
      .replace(/^### (.*$)/gim, '<h3>$1</h3>')
      .replace(/^## (.*$)/gim, '<h2>$1</h2>')
      .replace(/^# (.*$)/gim, '<h1>$1</h1>')
      
      // Bold and Italic
      .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/gim, '<em>$1</em>')
      .replace(/__(.*?)__/gim, '<strong>$1</strong>')
      .replace(/_(.*?)_/gim, '<em>$1</em>')
      
      // Code
      .replace(/`(.*?)`/gim, '<code>$1</code>')
      
      // Links
      .replace(/\[([^\]]+)\]\(([^)]+)\)/gim, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
      
      // Lists
      .replace(/^\* (.+)$/gim, '<li>$1</li>')
      .replace(/^- (.+)$/gim, '<li>$1</li>')
      .replace(/^\d+\. (.+)$/gim, '<li>$1</li>')
      
      // Blockquotes
      .replace(/^> (.+)$/gim, '<blockquote>$1</blockquote>')
      
      // Line breaks
      .replace(/\n\n/gim, '</p><p>')
      .replace(/\n/gim, '<br>')
      
      // Wrap in paragraphs
      .replace(/^(?!<[h|l|b])(.+)$/gim, '<p>$1</p>')
      
      // Clean up empty paragraphs
      .replace(/<p><\/p>/gim, '')
      .replace(/<p><br><\/p>/gim, '');
  };

  const getDeviceClass = () => {
    const baseClass = 'preview-device transition-all duration-300 bg-white shadow-lg rounded-lg overflow-hidden';
    
    switch (viewMode) {
      case 'mobile':
        return `${baseClass} w-80 ${orientation === 'landscape' ? 'h-64' : 'h-96'}`;
      case 'tablet':
        return `${baseClass} w-96 ${orientation === 'landscape' ? 'h-72' : 'h-128'}`;
      default:
        return `${baseClass} w-full h-full`;
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 500);
  };

  const handleZoomChange = (direction) => {
    if (direction === 'in' && zoom < 200) {
      setZoom(zoom + 25);
    } else if (direction === 'out' && zoom > 50) {
      setZoom(zoom - 25);
    } else if (direction === 'reset') {
      setZoom(100);
    }
  };

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      previewRef.current?.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
    setIsFullscreen(!isFullscreen);
  };

  const previewContent = parseMarkdown(content);
  const readingTime = Math.ceil(content.split(' ').length / 200);

  return (
    <div className={`flex flex-col h-full bg-gray-50 ${className}`}>
      {/* Preview Header */}
      <div className="flex items-center justify-between p-4 bg-white border-b border-gray-200">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Eye className="h-5 w-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">Live Preview</h3>
          </div>
          
          {/* Device Toggle */}
          <div className="flex items-center bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('desktop')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'desktop' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'
              }`}
              title="Desktop View"
            >
              <Monitor className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('tablet')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'tablet' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'
              }`}
              title="Tablet View"
            >
              <Tablet className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('mobile')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'mobile' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'
              }`}
              title="Mobile View"
            >
              <Smartphone className="h-4 w-4" />
            </button>
          </div>

          {/* Orientation Toggle (for mobile/tablet) */}
          {(viewMode === 'mobile' || viewMode === 'tablet') && (
            <button
              onClick={() => setOrientation(orientation === 'portrait' ? 'landscape' : 'portrait')}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
              title="Toggle Orientation"
            >
              <RotateCw className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="flex items-center space-x-2">
          {/* Zoom Controls */}
          <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => handleZoomChange('out')}
              className="p-1 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded transition-colors"
              disabled={zoom <= 50}
            >
              <ZoomOut className="h-3 w-3" />
            </button>
            <span className="px-2 text-xs font-medium text-gray-700 min-w-12 text-center">
              {zoom}%
            </span>
            <button
              onClick={() => handleZoomChange('in')}
              className="p-1 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded transition-colors"
              disabled={zoom >= 200}
            >
              <ZoomIn className="h-3 w-3" />
            </button>
          </div>

          {/* Action Buttons */}
          <button
            onClick={handleRefresh}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
            title="Refresh Preview"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={toggleFullscreen}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
            title="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </button>

          <div className="relative">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
              title="Preview Settings"
            >
              <Settings className="h-4 w-4" />
            </button>

            {/* Settings Dropdown */}
            {showSettings && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowSettings(false)}
                />
                <div className="absolute top-full right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
                  <div className="p-4">
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Theme
                        </label>
                        <select
                          value={theme}
                          onChange={(e) => onThemeChange?.(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="light">Light</option>
                          <option value="dark">Dark</option>
                          <option value="sepia">Sepia</option>
                          <option value="high-contrast">High Contrast</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Font Size
                        </label>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                          <option>Small</option>
                          <option>Medium</option>
                          <option>Large</option>
                          <option>Extra Large</option>
                        </select>
                      </div>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-gray-200 space-y-2">
                      <button
                        onClick={() => {
                          onExport?.('pdf');
                          setShowSettings(false);
                        }}
                        className="flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
                      >
                        <Download className="h-4 w-4 mr-3" />
                        Export as PDF
                      </button>
                      <button
                        onClick={() => {
                          window.print();
                          setShowSettings(false);
                        }}
                        className="flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
                      >
                        <Printer className="h-4 w-4 mr-3" />
                        Print Preview
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Preview Content */}
      <div 
        ref={previewRef}
        className="flex-1 p-6 overflow-auto bg-gray-100"
        style={{ zoom: `${zoom}%` }}
      >
        <div className="flex justify-center">
          <div className={getDeviceClass()}>
            {/* Device Frame Header (for mobile/tablet) */}
            {(viewMode === 'mobile' || viewMode === 'tablet') && (
              <div className="bg-gray-800 h-6 flex items-center justify-center">
                <div className="flex space-x-1">
                  <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                  <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                  <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                </div>
              </div>
            )}

            {/* Content Area */}
            <div 
              ref={contentRef}
              className={`h-full overflow-auto ${theme === 'dark' ? 'bg-gray-900 text-white' : 
                theme === 'sepia' ? 'bg-yellow-50 text-yellow-900' : 
                theme === 'high-contrast' ? 'bg-black text-yellow-400' : 'bg-white text-gray-900'}`}
            >
              {/* Content Header */}
              <div className="p-6 border-b border-gray-200">
                <h1 className="text-3xl font-bold mb-2">{title}</h1>
                {description && (
                  <p className="text-gray-600 mb-4">{description}</p>
                )}
                
                {/* Reading Stats */}
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <span>{content.split(' ').length} words</span>
                  <span>•</span>
                  <span>{readingTime} min read</span>
                  <span>•</span>
                  <span>Last updated: {new Date().toLocaleDateString()}</span>
                </div>
              </div>

              {/* Main Content */}
              <div className="p-6">
                {content ? (
                  <div 
                    className="prose prose-lg max-w-none"
                    dangerouslySetInnerHTML={{ __html: previewContent }}
                  />
                ) : (
                  <div className="text-center py-12">
                    <Layers className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-500 mb-2">
                      No content to preview
                    </h3>
                    <p className="text-gray-400">
                      Start typing in the editor to see a live preview here.
                    </p>
                  </div>
                )}
              </div>

              {/* Chapter Navigation (if multiple chapters) */}
              {chapters.length > 1 && (
                <div className="p-6 border-t border-gray-200 bg-gray-50">
                  <h4 className="text-lg font-semibold mb-4">Other Chapters</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {chapters.map((chapter) => (
                      <div
                        key={chapter.id}
                        className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                          chapter.id === activeChapterId
                            ? 'bg-blue-50 border-blue-200'
                            : 'bg-white border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        <h5 className="font-medium text-sm">{chapter.title}</h5>
                        {chapter.description && (
                          <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                            {chapter.description}
                          </p>
                        )}
                        <div className="flex items-center justify-between mt-2 text-xs text-gray-400">
                          <span>{chapter.wordCount || 0} words</span>
                          <span className={`px-2 py-1 rounded-full ${
                            chapter.status === 'complete' ? 'bg-green-100 text-green-600' :
                            chapter.status === 'draft' ? 'bg-yellow-100 text-yellow-600' :
                            'bg-gray-100 text-gray-600'
                          }`}>
                            {chapter.status || 'draft'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Preview Footer */}
      <div className="flex items-center justify-between p-4 bg-white border-t border-gray-200 text-sm text-gray-600">
        <div className="flex items-center space-x-4">
          <span>Preview Mode: {viewMode}</span>
          {(viewMode === 'mobile' || viewMode === 'tablet') && (
            <span>• {orientation}</span>
          )}
          <span>• Zoom: {zoom}%</span>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleZoomChange('reset')}
            className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded transition-colors"
          >
            Reset Zoom
          </button>
        </div>
      </div>

      {/* CSS Styles for Preview Content */}
      <style jsx>{`
        .prose {
          line-height: 1.7;
        }
        
        .prose h1 {
          font-size: 2.25rem;
          font-weight: 700;
          margin-bottom: 1rem;
          line-height: 1.2;
        }
        
        .prose h2 {
          font-size: 1.875rem;
          font-weight: 600;
          margin-top: 2rem;
          margin-bottom: 1rem;
          line-height: 1.3;
        }
        
        .prose h3 {
          font-size: 1.5rem;
          font-weight: 600;
          margin-top: 1.5rem;
          margin-bottom: 0.75rem;
          line-height: 1.4;
        }
        
        .prose p {
          margin-bottom: 1.25rem;
          text-align: justify;
        }
        
        .prose ul, .prose ol {
          margin-bottom: 1.25rem;
          padding-left: 1.5rem;
        }
        
        .prose li {
          margin-bottom: 0.5rem;
        }
        
        .prose blockquote {
          border-left: 4px solid #e5e7eb;
          padding-left: 1rem;
          margin: 1.5rem 0;
          font-style: italic;
          color: #6b7280;
        }
        
        .prose code {
          background-color: #f3f4f6;
          padding: 0.125rem 0.25rem;
          border-radius: 0.25rem;
          font-size: 0.875em;
          font-family: ui-monospace, SFMono-Regular, 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace;
        }
        
        .prose a {
          color: #3b82f6;
          text-decoration: underline;
        }
        
        .prose a:hover {
          color: #1d4ed8;
        }
        
        .prose strong {
          font-weight: 600;
        }
        
        .prose em {
          font-style: italic;
        }
        
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        /* Theme-specific styles */
        .prose.dark h1, .prose.dark h2, .prose.dark h3 {
          color: #f9fafb;
        }
        
        .prose.dark blockquote {
          border-left-color: #374151;
          color: #9ca3af;
        }
        
        .prose.dark code {
          background-color: #374151;
          color: #f9fafb;
        }
        
        .prose.sepia h1, .prose.sepia h2, .prose.sepia h3 {
          color: #92400e;
        }
        
        .prose.sepia blockquote {
          border-left-color: #fbbf24;
          color: #b45309;
        }
        
        .prose.sepia code {
          background-color: #fef3c7;
          color: #92400e;
        }
        
        .prose.high-contrast blockquote {
          border-left-color: #facc15;
          color: #eab308;
        }
        
        .prose.high-contrast code {
          background-color: #1f2937;
          color: #facc15;
        }
      `}</style>
    </div>
  );
};

export default PreviewPanel;