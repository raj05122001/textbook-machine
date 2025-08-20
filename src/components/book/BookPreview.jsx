'use client';

import { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Maximize2, 
  Minimize2, 
  Download, 
  Share2, 
  Edit3, 
  BookOpen, 
  Play, 
  Eye, 
  EyeOff,
  ChevronLeft, 
  ChevronRight, 
  FileText, 
  Clock, 
  User, 
  Calendar, 
  Star, 
  Bookmark, 
  Tag,
  MoreHorizontal,
  Heart,
  MessageSquare,
  Settings,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Printer,
  Copy,
  ExternalLink,
  Layers,
  Search,
  Filter,
  Sun,
  Moon,
  Type,
  AlignLeft,
  AlignCenter,
  AlignJustify,
  Minus,
  Plus,
  Volume2,
  VolumeX,
  Pause,
  SkipBack,
  SkipForward
} from 'lucide-react';

const BookPreview = ({
  book = {},
  chapters = [],
  isOpen = false,
  onClose,
  onEdit,
  onRead,
  onDownload,
  onShare,
  onBookmark,
  onDelete,
  initialChapter = 0,
  readOnly = false,
  showFullControls = true,
  className = ''
}) => {
  const [currentChapter, setCurrentChapter] = useState(initialChapter);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [previewMode, setPreviewMode] = useState('reader'); // 'reader', 'overview', 'chapters'
  const [showControls, setShowControls] = useState(true);
  const [isBookmarked, setIsBookmarked] = useState(book.isBookmarked || false);
  const [showSettings, setShowSettings] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearch, setShowSearch] = useState(false);
  const [showTableOfContents, setShowTableOfContents] = useState(false);
  
  // Reading settings
  const [settings, setSettings] = useState({
    theme: 'light', // 'light', 'dark', 'sepia'
    fontSize: 16,
    fontFamily: 'serif',
    lineHeight: 1.6,
    textAlign: 'left',
    showWordCount: true,
    showReadingTime: true,
    autoScroll: false,
    highlightLinks: true,
    showProgress: true
  });

  // Audio reading
  const [isReading, setIsReading] = useState(false);
  const [speechSynthesis, setSpeechSynthesis] = useState(null);
  const [readingSpeed, setReadingSpeed] = useState(1);

  const [zoom, setZoom] = useState(100);
  const [scrollProgress, setScrollProgress] = useState(0);
  const modalRef = useRef(null);
  const contentRef = useRef(null);

  const currentChapterData = chapters[currentChapter];
  const totalChapters = chapters.length;

  // Initialize speech synthesis
  useEffect(() => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      setSpeechSynthesis(window.speechSynthesis);
    }
  }, []);

  // Handle keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      switch (e.key) {
        case 'Escape':
          if (isFullscreen) {
            setIsFullscreen(false);
          } else {
            onClose?.();
          }
          break;
        case 'ArrowLeft':
          if (e.ctrlKey || e.metaKey) {
            goToPreviousChapter();
          }
          break;
        case 'ArrowRight':
          if (e.ctrlKey || e.metaKey) {
            goToNextChapter();
          }
          break;
        case 'f':
        case 'F11':
          e.preventDefault();
          toggleFullscreen();
          break;
        case 'h':
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            setShowControls(!showControls);
          }
          break;
        case 'k':
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            setShowSearch(true);
          }
          break;
        case 't':
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            setShowTableOfContents(!showTableOfContents);
          }
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentChapter, totalChapters, isFullscreen, showControls, showTableOfContents, onClose]);

  // Auto-hide controls in fullscreen
  useEffect(() => {
    if (!isFullscreen) return;

    let timeoutId;
    const resetTimeout = () => {
      clearTimeout(timeoutId);
      setShowControls(true);
      timeoutId = setTimeout(() => setShowControls(false), 3000);
    };

    const handleMouseMove = () => resetTimeout();
    resetTimeout();

    document.addEventListener('mousemove', handleMouseMove);
    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isFullscreen]);

  // Track scroll progress
  useEffect(() => {
    const handleScroll = () => {
      if (contentRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = contentRef.current;
        const progress = (scrollTop / (scrollHeight - clientHeight)) * 100;
        setScrollProgress(Math.min(100, Math.max(0, progress)));
      }
    };

    const element = contentRef.current;
    if (element) {
      element.addEventListener('scroll', handleScroll);
      return () => element.removeEventListener('scroll', handleScroll);
    }
  }, [previewMode]);

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      modalRef.current?.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
    setIsFullscreen(!isFullscreen);
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    onBookmark?.(book.id, !isBookmarked);
  };

  const goToPreviousChapter = () => {
    if (currentChapter > 0) {
      setCurrentChapter(currentChapter - 1);
    }
  };

  const goToNextChapter = () => {
    if (currentChapter < totalChapters - 1) {
      setCurrentChapter(currentChapter + 1);
    }
  };

  const searchInContent = (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    const results = [];
    chapters.forEach((chapter, chapterIndex) => {
      const content = chapter.content || '';
      const lowerContent = content.toLowerCase();
      const lowerQuery = query.toLowerCase();
      
      let searchIndex = 0;
      while ((searchIndex = lowerContent.indexOf(lowerQuery, searchIndex)) !== -1) {
        const start = Math.max(0, searchIndex - 50);
        const end = Math.min(content.length, searchIndex + query.length + 50);
        const excerpt = content.substring(start, end);
        
        results.push({
          chapterIndex,
          chapterTitle: chapter.title,
          excerpt: excerpt.replace(
            new RegExp(query, 'gi'), 
            `<mark class="bg-yellow-200 text-black">$&</mark>`
          ),
          position: searchIndex
        });
        
        searchIndex += query.length;
      }
    });
    
    setSearchResults(results);
  };

  const goToSearchResult = (chapterIndex, position) => {
    setCurrentChapter(chapterIndex);
    setPreviewMode('reader');
    setShowSearch(false);
    // Scroll to position would be implemented here
  };

  const startReading = () => {
    if (!speechSynthesis || !currentChapterData) return;
    
    const utterance = new SpeechSynthesisUtterance(currentChapterData.content);
    utterance.rate = readingSpeed;
    utterance.onend = () => setIsReading(false);
    
    speechSynthesis.speak(utterance);
    setIsReading(true);
  };

  const stopReading = () => {
    if (speechSynthesis) {
      speechSynthesis.cancel();
    }
    setIsReading(false);
  };

  const getThemeClasses = () => {
    switch (settings.theme) {
      case 'dark':
        return 'bg-gray-900 text-gray-100';
      case 'sepia':
        return 'bg-yellow-50 text-yellow-900';
      default:
        return 'bg-white text-gray-900';
    }
  };

  const formatWordCount = (text) => {
    return text ? text.split(/\s+/).filter(word => word.length > 0).length : 0;
  };

  const formatReadingTime = (wordCount) => {
    const minutes = Math.ceil(wordCount / 200);
    return minutes < 60 ? `${minutes}m` : `${Math.floor(minutes / 60)}h ${minutes % 60}m`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-75 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div 
        ref={modalRef}
        className={`relative w-full h-full flex flex-col ${getThemeClasses()} ${className}`}
      >
        {/* Header */}
        {showControls && (
          <div className="flex-shrink-0 bg-black bg-opacity-50 backdrop-blur-sm border-b border-white border-opacity-10">
            <div className="flex items-center justify-between p-4">
              {/* Left Side */}
              <div className="flex items-center space-x-4">
                <button
                  onClick={onClose}
                  className="p-2 text-white hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
                  title="Close (Esc)"
                >
                  <X className="h-5 w-5" />
                </button>
                
                <div className="text-white">
                  <h1 className="text-lg font-semibold truncate max-w-md">{book.title}</h1>
                  <p className="text-sm text-gray-300">
                    {book.author && `by ${book.author} • `}
                    {previewMode === 'reader' && currentChapterData ? 
                      `Chapter ${currentChapter + 1}: ${currentChapterData.title}` : 
                      `${previewMode.charAt(0).toUpperCase() + previewMode.slice(1)} View`
                    }
                  </p>
                </div>
              </div>

              {/* Center - Mode Toggle */}
              <div className="flex items-center bg-black bg-opacity-30 rounded-lg p-1">
                <button
                  onClick={() => setPreviewMode('overview')}
                  className={`px-3 py-2 text-sm rounded-md transition-colors ${
                    previewMode === 'overview' ? 'bg-white text-gray-900' : 'text-white hover:bg-white hover:bg-opacity-20'
                  }`}
                  title="Book Overview"
                >
                  <BookOpen className="h-4 w-4 md:hidden" />
                  <span className="hidden md:inline">Overview</span>
                </button>
                <button
                  onClick={() => setPreviewMode('chapters')}
                  className={`px-3 py-2 text-sm rounded-md transition-colors ${
                    previewMode === 'chapters' ? 'bg-white text-gray-900' : 'text-white hover:bg-white hover:bg-opacity-20'
                  }`}
                  title="Table of Contents"
                >
                  <Layers className="h-4 w-4 md:hidden" />
                  <span className="hidden md:inline">Chapters</span>
                </button>
                <button
                  onClick={() => setPreviewMode('reader')}
                  className={`px-3 py-2 text-sm rounded-md transition-colors ${
                    previewMode === 'reader' ? 'bg-white text-gray-900' : 'text-white hover:bg-white hover:bg-opacity-20'
                  }`}
                  title="Reader View"
                >
                  <Eye className="h-4 w-4 md:hidden" />
                  <span className="hidden md:inline">Reader</span>
                </button>
              </div>

              {/* Right Side */}
              <div className="flex items-center space-x-2">
                {/* Reading Controls */}
                {previewMode === 'reader' && speechSynthesis && (
                  <div className="flex items-center space-x-1 bg-black bg-opacity-30 rounded-lg p-1">
                    <button
                      onClick={isReading ? stopReading : startReading}
                      className="p-2 text-white hover:bg-white hover:bg-opacity-20 rounded-md transition-colors"
                      title={isReading ? "Stop Reading" : "Start Reading"}
                    >
                      {isReading ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                    </button>
                  </div>
                )}

                {/* Navigation Controls */}
                {previewMode === 'reader' && totalChapters > 1 && (
                  <div className="flex items-center space-x-1 bg-black bg-opacity-30 rounded-lg p-1">
                    <button
                      onClick={goToPreviousChapter}
                      disabled={currentChapter === 0}
                      className="p-2 text-white hover:bg-white hover:bg-opacity-20 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Previous Chapter"
                    >
                      <SkipBack className="h-4 w-4" />
                    </button>
                    
                    <span className="px-2 text-white text-sm">
                      {currentChapter + 1}/{totalChapters}
                    </span>
                    
                    <button
                      onClick={goToNextChapter}
                      disabled={currentChapter === totalChapters - 1}
                      className="p-2 text-white hover:bg-white hover:bg-opacity-20 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Next Chapter"
                    >
                      <SkipForward className="h-4 w-4" />
                    </button>
                  </div>
                )}
                
                <button
                  onClick={() => setShowSearch(!showSearch)}
                  className="p-2 text-white hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
                  title="Search (Ctrl+K)"
                >
                  <Search className="h-5 w-5" />
                </button>
                
                <button
                  onClick={handleBookmark}
                  className={`p-2 rounded-lg transition-colors ${
                    isBookmarked ? 'text-yellow-400 bg-yellow-400 bg-opacity-20' : 'text-white hover:bg-white hover:bg-opacity-20'
                  }`}
                  title="Bookmark"
                >
                  <Bookmark className={`h-5 w-5 ${isBookmarked ? 'fill-current' : ''}`} />
                </button>
                
                <button
                  onClick={() => setShowSettings(!showSettings)}
                  className="p-2 text-white hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
                  title="Settings"
                >
                  <Settings className="h-5 w-5" />
                </button>
                
                <button
                  onClick={toggleFullscreen}
                  className="p-2 text-white hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
                  title="Fullscreen (F)"
                >
                  {isFullscreen ? <Minimize2 className="h-5 w-5" /> : <Maximize2 className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Progress Bar */}
            {settings.showProgress && previewMode === 'reader' && (
              <div className="h-1 bg-black bg-opacity-30">
                <div 
                  className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300"
                  style={{ width: `${scrollProgress}%` }}
                />
              </div>
            )}
          </div>
        )}

        {/* Search Panel */}
        {showSearch && (
          <div className="absolute top-16 right-4 w-80 bg-white rounded-lg shadow-xl border z-30 max-h-96 overflow-hidden">
            <div className="p-4 border-b">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search in book..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    searchInContent(e.target.value);
                  }}
                  className="w-full pl-4 pr-10 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  autoFocus
                />
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
            </div>
            
            {searchResults.length > 0 && (
              <div className="max-h-64 overflow-y-auto">
                {searchResults.slice(0, 10).map((result, index) => (
                  <button
                    key={index}
                    onClick={() => goToSearchResult(result.chapterIndex, result.position)}
                    className="w-full p-3 text-left hover:bg-gray-50 border-b last:border-b-0"
                  >
                    <div className="text-sm font-medium text-gray-900 mb-1">
                      Chapter {result.chapterIndex + 1}: {result.chapterTitle}
                    </div>
                    <div 
                      className="text-xs text-gray-600 line-clamp-2"
                      dangerouslySetInnerHTML={{ __html: `...${result.excerpt}...` }}
                    />
                  </button>
                ))}
              </div>
            )}
            
            {searchQuery && searchResults.length === 0 && (
              <div className="p-4 text-center text-gray-500">
                No results found for "{searchQuery}"
              </div>
            )}
            
            <div className="p-2 border-t bg-gray-50 text-xs text-gray-500">
              Press Ctrl+K to search • Use arrow keys to navigate
            </div>
          </div>
        )}

        {/* Settings Panel */}
        {showSettings && (
          <div className="absolute top-16 right-4 w-72 bg-white rounded-lg shadow-xl border z-30 max-h-96 overflow-y-auto">
            <div className="p-4 border-b">
              <h3 className="font-semibold text-gray-900">Reading Settings</h3>
            </div>
            
            <div className="p-4 space-y-4">
              {/* Theme */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Theme</label>
                <div className="flex space-x-2">
                  {[
                    { value: 'light', icon: Sun, label: 'Light' },
                    { value: 'dark', icon: Moon, label: 'Dark' },
                    { value: 'sepia', icon: Eye, label: 'Sepia' }
                  ].map(({ value, icon: Icon, label }) => (
                    <button
                      key={value}
                      onClick={() => setSettings(prev => ({ ...prev, theme: value }))}
                      className={`flex-1 p-2 rounded-lg border text-xs flex items-center justify-center space-x-1 transition-colors ${
                        settings.theme === value ? 'bg-blue-100 border-blue-500 text-blue-700' : 'border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <Icon className="h-3 w-3" />
                      <span>{label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Font Size */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Font Size: {settings.fontSize}px
                </label>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setSettings(prev => ({ 
                      ...prev, 
                      fontSize: Math.max(12, prev.fontSize - 2) 
                    }))}
                    className="p-1 border rounded hover:bg-gray-50"
                  >
                    <Minus className="h-3 w-3" />
                  </button>
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full transition-all"
                      style={{ width: `${((settings.fontSize - 12) / 12) * 100}%` }}
                    />
                  </div>
                  <button
                    onClick={() => setSettings(prev => ({ 
                      ...prev, 
                      fontSize: Math.min(24, prev.fontSize + 2) 
                    }))}
                    className="p-1 border rounded hover:bg-gray-50"
                  >
                    <Plus className="h-3 w-3" />
                  </button>
                </div>
              </div>

              {/* Font Family */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Font Family</label>
                <select
                  value={settings.fontFamily}
                  onChange={(e) => setSettings(prev => ({ ...prev, fontFamily: e.target.value }))}
                  className="w-full p-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="serif">Serif (Times)</option>
                  <option value="sans-serif">Sans Serif (Arial)</option>
                  <option value="monospace">Monospace (Courier)</option>
                </select>
              </div>

              {/* Text Alignment */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Text Alignment</label>
                <div className="flex space-x-2">
                  {[
                    { value: 'left', icon: AlignLeft, label: 'Left' },
                    { value: 'center', icon: AlignCenter, label: 'Center' },
                    { value: 'justify', icon: AlignJustify, label: 'Justify' }
                  ].map(({ value, icon: Icon, label }) => (
                    <button
                      key={value}
                      onClick={() => setSettings(prev => ({ ...prev, textAlign: value }))}
                      className={`flex-1 p-2 rounded border text-xs flex items-center justify-center space-x-1 transition-colors ${
                        settings.textAlign === value ? 'bg-blue-100 border-blue-500 text-blue-700' : 'border-gray-300 hover:bg-gray-50'
                      }`}
                      title={label}
                    >
                      <Icon className="h-3 w-3" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Reading Options */}
              <div className="space-y-2">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={settings.showWordCount}
                    onChange={(e) => setSettings(prev => ({ ...prev, showWordCount: e.target.checked }))}
                    className="rounded"
                  />
                  <span className="text-sm">Show word count</span>
                </label>
                
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={settings.showReadingTime}
                    onChange={(e) => setSettings(prev => ({ ...prev, showReadingTime: e.target.checked }))}
                    className="rounded"
                  />
                  <span className="text-sm">Show reading time</span>
                </label>
                
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={settings.showProgress}
                    onChange={(e) => setSettings(prev => ({ ...prev, showProgress: e.target.checked }))}
                    className="rounded"
                  />
                  <span className="text-sm">Show progress bar</span>
                </label>
              </div>

              {/* Reading Speed */}
              {speechSynthesis && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Reading Speed: {readingSpeed}x
                  </label>
                  <input
                    type="range"
                    min="0.5"
                    max="2"
                    step="0.1"
                    value={readingSpeed}
                    onChange={(e) => setReadingSpeed(parseFloat(e.target.value))}
                    className="w-full"
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1 overflow-hidden">
          {previewMode === 'overview' && (
            <div 
              ref={contentRef}
              className="h-full overflow-y-auto p-8"
            >
              <div className="max-w-4xl mx-auto">
                {/* Book Cover and Info */}
                <div className="flex flex-col lg:flex-row gap-8 mb-8">
                  {/* Cover */}
                  <div className="flex-shrink-0 mx-auto lg:mx-0">
                    <div 
                      className="w-48 h-64 rounded-lg shadow-xl flex items-center justify-center overflow-hidden"
                      style={{
                        background: book.coverColor || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                      }}
                    >
                      {book.coverImage ? (
                        <img 
                          src={book.coverImage} 
                          alt={book.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <BookOpen className="h-16 w-16 text-white opacity-50" />
                      )}
                    </div>
                  </div>

                  {/* Info */}
                  <div className="flex-1">
                    <h1 className="text-3xl font-bold mb-2">{book.title}</h1>
                    {book.subtitle && (
                      <p className="text-xl text-gray-600 mb-4">{book.subtitle}</p>
                    )}
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <User className="h-4 w-4 text-gray-500" />
                          <span className="text-gray-600">Author:</span>
                          <span className="font-medium">{book.author || 'Unknown'}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <FileText className="h-4 w-4 text-gray-500" />
                          <span className="text-gray-600">Status:</span>
                          <span className="font-medium capitalize">{book.status || 'Draft'}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <BookOpen className="h-4 w-4 text-gray-500" />
                          <span className="text-gray-600">Chapters:</span>
                          <span className="font-medium">{totalChapters}</span>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Type className="h-4 w-4 text-gray-500" />
                          <span className="text-gray-600">Words:</span>
                          <span className="font-medium">{(book.wordCount || 0).toLocaleString()}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4 text-gray-500" />
                          <span className="text-gray-600">Created:</span>
                          <span className="font-medium">{formatDate(book.createdAt)}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Clock className="h-4 w-4 text-gray-500" />
                          <span className="text-gray-600">Updated:</span>
                          <span className="font-medium">{formatDate(book.lastModified)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Rating */}
                    {book.rating > 0 && (
                      <div className="flex items-center space-x-2 mb-4">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i}
                              className={`h-4 w-4 ${
                                i < book.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-600">
                          {book.rating}/5 ({book.reviewCount || 0} reviews)
                        </span>
                      </div>
                    )}

                    {/* Description */}
                    {book.description && (
                      <div className="mb-6">
                        <h3 className="font-semibold mb-2">Description</h3>
                        <p className="text-gray-700 leading-relaxed">{book.description}</p>
                      </div>
                    )}

                    {/* Tags */}
                    {book.tags && book.tags.length > 0 && (
                      <div className="mb-6">
                        <h3 className="font-semibold mb-2">Tags</h3>
                        <div className="flex flex-wrap gap-2">
                          {book.tags.map(tag => (
                            <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-sm flex items-center space-x-1">
                              <Tag className="h-3 w-3" />
                              <span>{tag}</span>
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                {showFullControls && (
                  <div className="flex flex-wrap gap-3 mb-8">
                    <button
                      onClick={() => {
                        setPreviewMode('reader');
                        setCurrentChapter(0);
                      }}
                      className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                    >
                      <Play className="h-4 w-4" />
                      <span>Start Reading</span>
                    </button>
                    
                    {!readOnly && (
                      <button
                        onClick={() => onEdit?.(book)}
                        className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center space-x-2"
                      >
                        <Edit3 className="h-4 w-4" />
                        <span>Edit Book</span>
                      </button>
                    )}
                    
                    <button
                      onClick={() => onDownload?.(book)}
                      className="px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2"
                    >
                      <Download className="h-4 w-4" />
                      <span>Download</span>
                    </button>
                    
                    <button
                      onClick={() => onShare?.(book)}
                      className="px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2"
                    >
                      <Share2 className="h-4 w-4" />
                      <span>Share</span>
                    </button>

                    <button
                      onClick={() => window.print()}
                      className="px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2"
                    >
                      <Printer className="h-4 w-4" />
                      <span>Print</span>
                    </button>
                  </div>
                )}

                {/* Statistics Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="font-semibold mb-4 flex items-center space-x-2">
                      <Clock className="h-5 w-5 text-blue-500" />
                      <span>Reading Stats</span>
                    </h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Estimated Reading Time:</span>
                        <span className="font-medium">{formatReadingTime(book.wordCount)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Pages (approx):</span>
                        <span className="font-medium">{Math.ceil((book.wordCount || 0) / 250)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Average Chapter:</span>
                        <span className="font-medium">{Math.round((book.wordCount || 0) / Math.max(1, totalChapters))} words</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Difficulty Level:</span>
                        <span className="font-medium">Intermediate</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="font-semibold mb-4 flex items-center space-x-2">
                      <BarChart3 className="h-5 w-5 text-green-500" />
                      <span>Progress</span>
                    </h3>
                    <div className="space-y-3 text-sm">
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-gray-600">Writing Completion:</span>
                          <span className="font-medium">{Math.round((book.completionProgress || 0))}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-green-500 h-2 rounded-full transition-all"
                            style={{ width: `${book.completionProgress || 0}%` }}
                          />
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-gray-600">Reading Progress:</span>
                          <span className="font-medium">{Math.round((book.readingProgress || 0))}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-500 h-2 rounded-full transition-all"
                            style={{ width: `${book.readingProgress || 0}%` }}
                          />
                        </div>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-gray-600">Last Read:</span>
                        <span className="font-medium">{book.lastReadDate ? formatDate(book.lastReadDate) : 'Never'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="font-semibold mb-4 flex items-center space-x-2">
                      <Heart className="h-5 w-5 text-pink-500" />
                      <span>Engagement</span>
                    </h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Bookmarks:</span>
                        <span className="font-medium">{book.bookmarkCount || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Shares:</span>
                        <span className="font-medium">{book.shareCount || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Downloads:</span>
                        <span className="font-medium">{book.downloadCount || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Comments:</span>
                        <span className="font-medium">{book.commentCount || 0}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recent Activity */}
                {book.recentActivity && book.recentActivity.length > 0 && (
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="font-semibold mb-4">Recent Activity</h3>
                    <div className="space-y-3">
                      {book.recentActivity.slice(0, 5).map((activity, index) => (
                        <div key={index} className="flex items-center space-x-3 text-sm">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <span className="text-gray-700">{activity.description}</span>
                          <span className="text-gray-500 ml-auto">{formatDate(activity.date)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {previewMode === 'chapters' && (
            <div 
              ref={contentRef}
              className="h-full overflow-y-auto p-6"
            >
              <div className="max-w-4xl mx-auto">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">Table of Contents</h2>
                  <div className="text-sm text-gray-600">
                    {totalChapters} chapters • {formatReadingTime(book.wordCount)} total reading time
                  </div>
                </div>
                
                <div className="space-y-4">
                  {chapters.map((chapter, index) => {
                    const wordCount = formatWordCount(chapter.content);
                    const readingTime = formatReadingTime(wordCount);
                    
                    return (
                      <div 
                        key={chapter.id}
                        className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors group"
                        onClick={() => {
                          setCurrentChapter(index);
                          setPreviewMode('reader');
                        }}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-sm font-medium">
                                Chapter {index + 1}
                              </span>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                chapter.status === 'completed' ? 'bg-green-100 text-green-800' :
                                chapter.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                                chapter.status === 'review' ? 'bg-orange-100 text-orange-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {chapter.status || 'draft'}
                              </span>
                            </div>
                            
                            <h3 className="font-semibold text-lg mb-2 group-hover:text-blue-600 transition-colors">
                              {chapter.title}
                            </h3>
                            
                            {chapter.description && (
                              <p className="text-gray-600 mb-3 line-clamp-2">{chapter.description}</p>
                            )}
                            
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                              <div className="flex items-center space-x-1">
                                <FileText className="h-4 w-4" />
                                <span>{wordCount.toLocaleString()} words</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Clock className="h-4 w-4" />
                                <span>{readingTime}</span>
                              </div>
                              {chapter.lastModified && (
                                <span>Updated {formatDate(chapter.lastModified)}</span>
                              )}
                            </div>

                            {/* Chapter Progress */}
                            {chapter.readingProgress > 0 && (
                              <div className="mt-3">
                                <div className="flex justify-between items-center mb-1">
                                  <span className="text-xs text-gray-600">Reading Progress</span>
                                  <span className="text-xs text-gray-600">{chapter.readingProgress}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-1">
                                  <div 
                                    className="bg-blue-500 h-1 rounded-full transition-all"
                                    style={{ width: `${chapter.readingProgress}%` }}
                                  />
                                </div>
                              </div>
                            )}
                          </div>
                          
                          <div className="ml-4 flex items-center">
                            <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Chapter Statistics */}
                <div className="mt-8 bg-gray-50 rounded-lg p-6">
                  <h3 className="font-semibold mb-4">Chapter Statistics</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {chapters.filter(ch => ch.status === 'completed').length}
                      </div>
                      <div className="text-gray-600">Completed</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {chapters.filter(ch => ch.status === 'in-progress').length}
                      </div>
                      <div className="text-gray-600">In Progress</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-yellow-600">
                        {chapters.filter(ch => ch.status === 'review').length}
                      </div>
                      <div className="text-gray-600">Review</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-600">
                        {chapters.filter(ch => !ch.status || ch.status === 'draft').length}
                      </div>
                      <div className="text-gray-600">Draft</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {previewMode === 'reader' && currentChapterData && (
            <div className="h-full flex">
              {/* Content */}
              <div 
                ref={contentRef}
                className="flex-1 overflow-y-auto"
              >
                <div 
                  className="max-w-4xl mx-auto p-8"
                  style={{ 
                    fontSize: `${settings.fontSize}px`,
                    fontFamily: settings.fontFamily,
                    lineHeight: settings.lineHeight,
                    textAlign: settings.textAlign
                  }}
                >
                  {/* Chapter Header */}
                  <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm text-gray-500 uppercase tracking-wide">
                        Chapter {currentChapter + 1} of {totalChapters}
                      </span>
                      {settings.showWordCount && (
                        <span className="text-sm text-gray-500">
                          {formatWordCount(currentChapterData.content).toLocaleString()} words
                        </span>
                      )}
                    </div>
                    
                    <h1 className="text-3xl font-bold mb-4">{currentChapterData.title}</h1>
                    
                    {currentChapterData.description && (
                      <p className="text-lg text-gray-600 mb-6 italic">
                        {currentChapterData.description}
                      </p>
                    )}
                    
                    {settings.showReadingTime && (
                      <div className="flex items-center space-x-4 text-sm text-gray-500 mb-6 pb-6 border-b border-gray-200">
                        <div className="flex items-center space-x-1">
                          <Clock className="h-4 w-4" />
                          <span>~{formatReadingTime(formatWordCount(currentChapterData.content))} reading time</span>
                        </div>
                        {currentChapterData.lastModified && (
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-4 w-4" />
                            <span>Updated {formatDate(currentChapterData.lastModified)}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Chapter Content */}
                  <div className="prose prose-lg max-w-none">
                    {currentChapterData.content ? (
                      <div 
                        className="leading-relaxed"
                        style={{ 
                          textAlign: settings.textAlign,
                          lineHeight: settings.lineHeight 
                        }}
                      >
                        {currentChapterData.content.split('\n\n').map((paragraph, index) => (
                          <p key={index} className="mb-4">
                            {paragraph}
                          </p>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12 text-gray-500">
                        <FileText className="h-16 w-16 mx-auto mb-4 opacity-50" />
                        <p>This chapter has no content yet.</p>
                      </div>
                    )}
                  </div>

                  {/* Chapter Navigation */}
                  <div className="flex items-center justify-between pt-12 mt-12 border-t border-gray-200">
                    <button
                      onClick={goToPreviousChapter}
                      disabled={currentChapter === 0}
                      className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronLeft className="h-5 w-5" />
                      <span>Previous Chapter</span>
                    </button>
                    
                    <div className="text-center">
                      <div className="text-sm text-gray-500 mb-2">
                        Chapter {currentChapter + 1} of {totalChapters}
                      </div>
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full transition-all"
                          style={{ width: `${((currentChapter + 1) / totalChapters) * 100}%` }}
                        />
                      </div>
                    </div>
                    
                    <button
                      onClick={goToNextChapter}
                      disabled={currentChapter === totalChapters - 1}
                      className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <span>Next Chapter</span>
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Keyboard Shortcuts Help */}
        {showControls && (
          <div className="absolute bottom-4 left-4 bg-black bg-opacity-75 text-white rounded-lg p-3 text-xs opacity-75 hidden lg:block">
            <div className="space-y-1">
              <div><kbd className="bg-gray-700 px-1 rounded">Esc</kbd> Close</div>
              <div><kbd className="bg-gray-700 px-1 rounded">F</kbd> Fullscreen</div>
              <div><kbd className="bg-gray-700 px-1 rounded">Ctrl+K</kbd> Search</div>
              <div><kbd className="bg-gray-700 px-1 rounded">←/→</kbd> Navigate chapters</div>
            </div>
          </div>
        )}

        {/* CSS for line clamping and custom styles */}
        <style jsx>{`
          .line-clamp-2 {
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }
          
          .prose p {
            margin-bottom: 1rem;
          }
          
          .prose p:last-child {
            margin-bottom: 0;
          }
          
          kbd {
            font-family: monospace;
            font-size: 0.75rem;
            padding: 0.125rem 0.25rem;
            border-radius: 0.25rem;
          }
          
          mark {
            padding: 0.125rem 0.25rem;
            border-radius: 0.125rem;
          }
        `}</style>
      </div>
    </div>
  );
};

export default BookPreview;