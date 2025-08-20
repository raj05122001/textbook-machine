'use client';

import { useState } from 'react';
import { 
  Save, 
  Download, 
  Upload, 
  Undo, 
  Redo, 
  Eye, 
  EyeOff, 
  Settings, 
  Share2, 
  Printer, 
  FileText, 
  Image, 
  Table, 
  Link, 
  Search, 
  Replace, 
  Zap,
  Clock,
  Users,
  BookOpen,
  ChevronDown,
  MoreHorizontal
} from 'lucide-react';

const ToolBar = ({ 
  onSave, 
  onExport, 
  onImport, 
  onUndo, 
  onRedo, 
  onTogglePreview, 
  onSettings, 
  onShare,
  canUndo = false,
  canRedo = false,
  isPreviewMode = false,
  hasUnsavedChanges = false,
  isGenerating = false,
  showCollaboration = false,
  bookStats = {},
  onAction
}) => {
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [showAIMenu, setShowAIMenu] = useState(false);

  const exportOptions = [
    { id: 'pdf', label: 'Export as PDF', icon: FileText },
    { id: 'docx', label: 'Export as DOCX', icon: FileText },
    { id: 'epub', label: 'Export as EPUB', icon: BookOpen },
    { id: 'html', label: 'Export as HTML', icon: FileText }
  ];

  const aiActions = [
    { id: 'generate-summary', label: 'Generate Summary', icon: FileText },
    { id: 'generate-questions', label: 'Generate Q&A', icon: Search },
    { id: 'improve-content', label: 'Improve Content', icon: Zap },
    { id: 'add-references', label: 'Add References', icon: Link }
  ];

  const handleExport = (format) => {
    onExport?.(format);
    setShowExportMenu(false);
  };

  const handleAIAction = (action) => {
    onAction?.(action);
    setShowAIMenu(false);
  };

  return (
    <div className="flex items-center justify-between p-4 bg-white border-b border-gray-200 sticky top-0 z-30">
      {/* Left Section - Primary Actions */}
      <div className="flex items-center space-x-2">
        {/* Save Button */}
        <button
          onClick={onSave}
          disabled={!hasUnsavedChanges}
          className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
            hasUnsavedChanges
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }`}
        >
          <Save className="h-4 w-4" />
          <span>Save</span>
          {hasUnsavedChanges && (
            <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
          )}
        </button>

        {/* Undo/Redo */}
        <div className="flex items-center border border-gray-200 rounded-lg">
          <button
            onClick={onUndo}
            disabled={!canUndo}
            className="p-2 text-gray-600 hover:bg-gray-100 disabled:text-gray-300 disabled:cursor-not-allowed rounded-l-lg transition-colors"
            title="Undo (Ctrl+Z)"
          >
            <Undo className="h-4 w-4" />
          </button>
          <div className="w-px h-6 bg-gray-200" />
          <button
            onClick={onRedo}
            disabled={!canRedo}
            className="p-2 text-gray-600 hover:bg-gray-100 disabled:text-gray-300 disabled:cursor-not-allowed rounded-r-lg transition-colors"
            title="Redo (Ctrl+Y)"
          >
            <Redo className="h-4 w-4" />
          </button>
        </div>

        {/* Preview Toggle */}
        <button
          onClick={onTogglePreview}
          className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
            isPreviewMode
              ? 'bg-green-100 text-green-700 hover:bg-green-200'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          {isPreviewMode ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          <span>{isPreviewMode ? 'Edit' : 'Preview'}</span>
        </button>

        {/* AI Actions */}
        <div className="relative">
          <button
            onClick={() => setShowAIMenu(!showAIMenu)}
            disabled={isGenerating}
            className="flex items-center space-x-2 px-3 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg text-sm font-medium hover:from-purple-700 hover:to-blue-700 transition-all disabled:opacity-50"
          >
            <Zap className="h-4 w-4" />
            <span>AI Assistant</span>
            {isGenerating ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </button>

          {/* AI Menu Dropdown */}
          {showAIMenu && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowAIMenu(false)}
              />
              <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
                <div className="py-1">
                  {aiActions.map((action) => {
                    const Icon = action.icon;
                    return (
                      <button
                        key={action.id}
                        onClick={() => handleAIAction(action.id)}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <Icon className="h-4 w-4 mr-3 text-purple-600" />
                        {action.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Center Section - Book Stats */}
      <div className="hidden lg:flex items-center space-x-6 text-sm text-gray-600">
        <div className="flex items-center space-x-2">
          <FileText className="h-4 w-4" />
          <span>{bookStats.chapters || 0} chapters</span>
        </div>
        <div className="flex items-center space-x-2">
          <span>{(bookStats.words || 0).toLocaleString()} words</span>
        </div>
        <div className="flex items-center space-x-2">
          <Clock className="h-4 w-4" />
          <span>{Math.ceil((bookStats.words || 0) / 200)} min read</span>
        </div>
        {showCollaboration && (
          <div className="flex items-center space-x-2">
            <Users className="h-4 w-4" />
            <span>3 collaborators</span>
          </div>
        )}
      </div>

      {/* Right Section - Secondary Actions */}
      <div className="flex items-center space-x-2">
        {/* Export Menu */}
        <div className="relative">
          <button
            onClick={() => setShowExportMenu(!showExportMenu)}
            className="flex items-center space-x-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
          >
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">Export</span>
            <ChevronDown className="h-4 w-4" />
          </button>

          {/* Export Dropdown */}
          {showExportMenu && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowExportMenu(false)}
              />
              <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
                <div className="py-1">
                  {exportOptions.map((option) => {
                    const Icon = option.icon;
                    return (
                      <button
                        key={option.id}
                        onClick={() => handleExport(option.id)}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <Icon className="h-4 w-4 mr-3" />
                        {option.label}
                      </button>
                    );
                  })}
                </div>
                <div className="border-t border-gray-100">
                  <button
                    onClick={() => {
                      onAction?.('print');
                      setShowExportMenu(false);
                    }}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <Printer className="h-4 w-4 mr-3" />
                    Print
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Share Button */}
        <button
          onClick={onShare}
          className="flex items-center space-x-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
        >
          <Share2 className="h-4 w-4" />
          <span className="hidden sm:inline">Share</span>
        </button>

        {/* More Menu */}
        <div className="relative">
          <button
            onClick={() => setShowMoreMenu(!showMoreMenu)}
            className="p-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <MoreHorizontal className="h-4 w-4" />
          </button>

          {/* More Dropdown */}
          {showMoreMenu && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowMoreMenu(false)}
              />
              <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
                <div className="py-1">
                  <button
                    onClick={() => {
                      onImport?.();
                      setShowMoreMenu(false);
                    }}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <Upload className="h-4 w-4 mr-3" />
                    Import Content
                  </button>
                  
                  <button
                    onClick={() => {
                      onAction?.('search');
                      setShowMoreMenu(false);
                    }}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <Search className="h-4 w-4 mr-3" />
                    Find & Replace
                  </button>
                  
                  <button
                    onClick={() => {
                      onAction?.('insert-table');
                      setShowMoreMenu(false);
                    }}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <Table className="h-4 w-4 mr-3" />
                    Insert Table
                  </button>
                  
                  <button
                    onClick={() => {
                      onAction?.('insert-image');
                      setShowMoreMenu(false);
                    }}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <Image className="h-4 w-4 mr-3" />
                    Insert Image
                  </button>
                  
                  <div className="border-t border-gray-100">
                    <button
                      onClick={() => {
                        onSettings?.();
                        setShowMoreMenu(false);
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <Settings className="h-4 w-4 mr-3" />
                      Settings
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Mobile Stats - Show on smaller screens */}
      <div className="lg:hidden fixed bottom-4 right-4 bg-white rounded-lg shadow-lg border border-gray-200 p-3">
        <div className="text-xs text-gray-600 space-y-1">
          <div>{bookStats.chapters || 0} chapters</div>
          <div>{(bookStats.words || 0).toLocaleString()} words</div>
        </div>
      </div>
    </div>
  );
};

export default ToolBar;