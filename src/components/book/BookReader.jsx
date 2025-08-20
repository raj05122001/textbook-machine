'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  BookOpen, 
  Bookmark, 
  Settings, 
  Maximize2, 
  Minimize2,
  Volume2,
  VolumeX,
  Play,
  Pause,
  RotateCcw,
  Share2,
  Download,
  Search,
  Menu,
  Sun,
  Moon,
  Minus,
  Plus,
  Type,
  Eye,
  Clock,
  MapPin
} from 'lucide-react';

const BookReader = ({ 
  book = {}, 
  chapters = [], 
  initialPage = 0,
  onPageChange,
  onBookmarkAdd,
  onProgressUpdate,
  onClose,
  className = ''
}) => {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [isFlipping, setIsFlipping] = useState(false);
  const [flipDirection, setFlipDirection] = useState('forward');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [showTableOfContents, setShowTableOfContents] = useState(false);
  const [showBookmarks, setShowBookmarks] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearch, setShowSearch] = useState(false);
  
  // Reading settings
  const [settings, setSettings] = useState({
    theme: 'light', // 'light', 'dark', 'sepia'
    fontSize: 16,
    fontFamily: 'serif', // 'serif', 'sans-serif', 'monospace'
    lineHeight: 1.6,
    margin: 'normal', // 'narrow', 'normal', 'wide'
    autoPlay: false,
    readingSpeed: 300, // words per minute
    soundEffects: true
  });

  // Audio and auto-reading
  const [isReading, setIsReading] = useState(false);
  const [speechSynthesis, setSpeechSynthesis] = useState(null);
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(0);

  // Reading progress and bookmarks
  const [bookmarks, setBookmarks] = useState(book.bookmarks || []);
  const [readingTime, setReadingTime] = useState(0);
  const [wordsRead, setWordsRead] = useState(0);

  const readerRef = useRef(null);
  const pageRef = useRef(null);
  const controlsTimeoutRef = useRef(null);
  const startTimeRef = useRef(Date.now());

  // Create pages from chapters
  const pages = chapters.flatMap(chapter => {
    const wordsPerPage = 250;
    const words = chapter.content.split(' ');
    const pageCount = Math.ceil(words.length / wordsPerPage);
    
    return Array.from({ length: pageCount }, (_, pageIndex) => {
      const startWord = pageIndex * wordsPerPage;
      const endWord = Math.min(startWord + wordsPerPage, words.length);
      const pageContent = words.slice(startWord, endWord).join(' ');
      
      return {
        id: `${chapter.id}-${pageIndex}`,
        chapterId: chapter.id,
        chapterTitle: chapter.title,
        pageNumber: pageIndex + 1,
        content: pageContent,
        isFirstPage: pageIndex === 0,
        isLastPage: pageIndex === pageCount - 1
      };
    });
  });

  const totalPages = pages.length;
  const currentPageData = pages[currentPage];
  const nextPageData = pages[currentPage + 1];

  // Initialize speech synthesis
  useEffect(() => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      setSpeechSynthesis(window.speechSynthesis);
      const loadVoices = () => {
        const availableVoices = window.speechSynthesis.getVoices();
        setVoices(availableVoices);
      };
      
      loadVoices();
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  // Auto-hide controls
  useEffect(() => {
    const resetControlsTimeout = () => {
      clearTimeout(controlsTimeoutRef.current);
      setShowControls(true);
      controlsTimeoutRef.current = setTimeout(() => {
        if (isFullscreen) {
          setShowControls(false);
        }
      }, 3000);
    };

    if (isFullscreen) {
      resetControlsTimeout();
      const handleMouseMove = () => resetControlsTimeout();
      document.addEventListener('mousemove', handleMouseMove);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        clearTimeout(controlsTimeoutRef.current);
      };
    }
  }, [isFullscreen]);

  // Update reading progress
  useEffect(() => {
    const interval = setInterval(() => {
      setReadingTime(prev => prev + 1);
      
      if (currentPageData) {
        const wordsOnPage = currentPageData.content.split(' ').length;
        setWordsRead(prev => prev + wordsOnPage / 60); // Estimate words read per second
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [currentPageData]);

  // Page navigation with animation
  const navigateToPage = useCallback((pageIndex, direction = 'forward') => {
    if (pageIndex < 0 || pageIndex >= totalPages || isFlipping) return;
    
    setIsFlipping(true);
    setFlipDirection(direction);
    
    if (settings.soundEffects) {
      // Play page flip sound effect
      const audio = new Audio('/sounds/page-flip.mp3');
      audio.volume = 0.3;
      audio.play().catch(() => {}); // Ignore errors if sound file doesn't exist
    }
    
    setTimeout(() => {
      setCurrentPage(pageIndex);
      setIsFlipping(false);
      onPageChange?.(pageIndex);
      
      // Update reading progress
      const progress = ((pageIndex + 1) / totalPages) * 100;
      onProgressUpdate?.(progress);
    }, 300);
  }, [totalPages, isFlipping, settings.soundEffects, onPageChange, onProgressUpdate]);

  const nextPage = () => navigateToPage(currentPage + 1, 'forward');
  const prevPage = () => navigateToPage(currentPage - 1, 'backward');
  const goToPage = (pageIndex) => {
    const direction = pageIndex > currentPage ? 'forward' : 'backward';
    navigateToPage(pageIndex, direction);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      switch (e.key) {
        case 'ArrowRight':
        case ' ':
          e.preventDefault();
          nextPage();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          prevPage();
          break;
        case 'Home':
          e.preventDefault();
          goToPage(0);
          break;
        case 'End':
          e.preventDefault();
          goToPage(totalPages - 1);
          break;
        case 'f':
        case 'F11':
          e.preventDefault();
          toggleFullscreen();
          break;
        case 'Escape':
          if (isFullscreen) {
            e.preventDefault();
            toggleFullscreen();
          }
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [currentPage, totalPages, isFullscreen]);

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      readerRef.current?.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
    setIsFullscreen(!isFullscreen);
  };

  const addBookmark = () => {
    const bookmark = {
      id: Date.now(),
      pageNumber: currentPage + 1,
      chapterTitle: currentPageData?.chapterTitle || '',
      content: currentPageData?.content.substring(0, 100) + '...',
      timestamp: new Date().toISOString()
    };
    
    const newBookmarks = [...bookmarks, bookmark];
    setBookmarks(newBookmarks);
    onBookmarkAdd?.(bookmark);
  };

  const startAutoReading = () => {
    if (!speechSynthesis || !currentPageData) return;
    
    const utterance = new SpeechSynthesisUtterance(currentPageData.content);
    if (voices[selectedVoice]) {
      utterance.voice = voices[selectedVoice];
    }
    utterance.rate = settings.readingSpeed / 200; // Convert WPM to speech rate
    
    utterance.onend = () => {
      setIsReading(false);
      if (settings.autoPlay && currentPage < totalPages - 1) {
        setTimeout(() => {
          nextPage();
          setTimeout(startAutoReading, 500);
        }, 1000);
      }
    };
    
    speechSynthesis.speak(utterance);
    setIsReading(true);
  };

  const stopAutoReading = () => {
    if (speechSynthesis) {
      speechSynthesis.cancel();
    }
    setIsReading(false);
  };

  const searchInBook = (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }
    
    const results = [];
    pages.forEach((page, index) => {
      const content = page.content.toLowerCase();
      const searchTerm = query.toLowerCase();
      const regex = new RegExp(searchTerm, 'gi');
      const matches = [...content.matchAll(regex)];
      
      matches.forEach(match => {
        const start = Math.max(0, match.index - 50);
        const end = Math.min(content.length, match.index + 50);
        const excerpt = page.content.substring(start, end);
        
        results.push({
          pageIndex: index,
          pageNumber: index + 1,
          chapterTitle: page.chapterTitle,
          excerpt,
          matchIndex: match.index
        });
      });
    });
    
    setSearchResults(results);
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

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div 
      ref={readerRef}
      className={`relative w-full h-screen overflow-hidden ${getThemeClasses()} ${className}`}
    >
      {/* Main Reading Area */}
      <div className="relative w-full h-full flex items-center justify-center p-4">
        {/* Book Container */}
        <div 
          className="relative max-w-6xl w-full h-full"
          style={{ perspective: '1200px' }}
        >
          {/* Left Page */}
          <div 
            className={`absolute left-0 top-0 w-1/2 h-full transform-gpu transition-transform duration-300 ${
              isFlipping && flipDirection === 'forward' ? 'rotate-y-180' : ''
            }`}
            style={{ 
              transformStyle: 'preserve-3d',
              transformOrigin: 'right center'
            }}
          >
            <div className="w-full h-full bg-white shadow-lg rounded-l-lg p-8 overflow-y-auto">
              {currentPage > 0 && (
                <div 
                  className="h-full flex flex-col"
                  style={{ 
                    fontSize: `${settings.fontSize}px`,
                    fontFamily: settings.fontFamily,
                    lineHeight: settings.lineHeight
                  }}
                >
                  {/* Chapter Title */}
                  {pages[currentPage - 1]?.isFirstPage && (
                    <h2 className="text-2xl font-bold mb-6 text-gray-800">
                      {pages[currentPage - 1]?.chapterTitle}
                    </h2>
                  )}
                  
                  {/* Page Content */}
                  <div className="flex-1">
                    <p className="text-justify leading-relaxed">
                      {pages[currentPage - 1]?.content}
                    </p>
                  </div>
                  
                  {/* Page Number */}
                  <div className="mt-4 text-center text-sm text-gray-500">
                    {currentPage}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Page */}
          <div 
            className={`absolute right-0 top-0 w-1/2 h-full transform-gpu transition-transform duration-300 ${
              isFlipping && flipDirection === 'backward' ? '-rotate-y-180' : ''
            }`}
            style={{ 
              transformStyle: 'preserve-3d',
              transformOrigin: 'left center'
            }}
          >
            <div className="w-full h-full bg-white shadow-lg rounded-r-lg p-8 overflow-y-auto">
              {currentPageData && (
                <div 
                  className="h-full flex flex-col"
                  style={{ 
                    fontSize: `${settings.fontSize}px`,
                    fontFamily: settings.fontFamily,
                    lineHeight: settings.lineHeight
                  }}
                >
                  {/* Chapter Title */}
                  {currentPageData.isFirstPage && (
                    <h2 className="text-2xl font-bold mb-6 text-gray-800">
                      {currentPageData.chapterTitle}
                    </h2>
                  )}
                  
                  {/* Page Content */}
                  <div className="flex-1">
                    <p className="text-justify leading-relaxed">
                      {currentPageData.content}
                    </p>
                  </div>
                  
                  {/* Page Number */}
                  <div className="mt-4 text-center text-sm text-gray-500">
                    {currentPage + 1}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Page Navigation Areas */}
          <button
            onClick={prevPage}
            disabled={currentPage === 0}
            className="absolute left-0 top-0 w-1/4 h-full z-10 opacity-0 hover:opacity-20 bg-black transition-opacity disabled:cursor-not-allowed disabled:hover:opacity-0"
            aria-label="Previous page"
          />
          
          <button
            onClick={nextPage}
            disabled={currentPage >= totalPages - 1}
            className="absolute right-0 top-0 w-1/4 h-full z-10 opacity-0 hover:opacity-20 bg-black transition-opacity disabled:cursor-not-allowed disabled:hover:opacity-0"
            aria-label="Next page"
          />
        </div>
      </div>

      {/* Controls */}
      {showControls && (
        <>
          {/* Top Bar */}
          <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/50 to-transparent p-4 z-20">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={onClose}
                  className="p-2 text-white hover:bg-white/20 rounded-lg transition-colors"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <h1 className="text-white font-semibold truncate max-w-md">
                  {book.title}
                </h1>
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setShowSearch(!showSearch)}
                  className="p-2 text-white hover:bg-white/20 rounded-lg transition-colors"
                >
                  <Search className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setShowTableOfContents(!showTableOfContents)}
                  className="p-2 text-white hover:bg-white/20 rounded-lg transition-colors"
                >
                  <Menu className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setShowBookmarks(!showBookmarks)}
                  className="p-2 text-white hover:bg-white/20 rounded-lg transition-colors"
                >
                  <Bookmark className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setShowSettings(!showSettings)}
                  className="p-2 text-white hover:bg-white/20 rounded-lg transition-colors"
                >
                  <Settings className="h-5 w-5" />
                </button>
                <button
                  onClick={toggleFullscreen}
                  className="p-2 text-white hover:bg-white/20 rounded-lg transition-colors"
                >
                  {isFullscreen ? <Minimize2 className="h-5 w-5" /> : <Maximize2 className="h-5 w-5" />}
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-4 z-20">
            <div className="flex items-center justify-between mb-4">
              {/* Navigation Controls */}
              <div className="flex items-center space-x-4">
                <button
                  onClick={prevPage}
                  disabled={currentPage === 0}
                  className="p-2 text-white hover:bg-white/20 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                
                <span className="text-white text-sm font-medium">
                  {currentPage + 1} / {totalPages}
                </span>
                
                <button
                  onClick={nextPage}
                  disabled={currentPage >= totalPages - 1}
                  className="p-2 text-white hover:bg-white/20 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>

              {/* Audio Controls */}
              <div className="flex items-center space-x-2">
                {speechSynthesis && (
                  <>
                    <button
                      onClick={isReading ? stopAutoReading : startAutoReading}
                      className="p-2 text-white hover:bg-white/20 rounded-lg transition-colors"
                    >
                      {isReading ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                    </button>
                    <button
                      onClick={() => setSettings(prev => ({ ...prev, soundEffects: !prev.soundEffects }))}
                      className="p-2 text-white hover:bg-white/20 rounded-lg transition-colors"
                    >
                      {settings.soundEffects ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
                    </button>
                  </>
                )}
              </div>

              {/* Additional Actions */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={addBookmark}
                  className="p-2 text-white hover:bg-white/20 rounded-lg transition-colors"
                >
                  <Bookmark className="h-5 w-5" />
                </button>
                <button
                  onClick={() => {/* Handle share */}}
                  className="p-2 text-white hover:bg-white/20 rounded-lg transition-colors"
                >
                  <Share2 className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full">
              <div className="flex justify-between text-xs text-white/70 mb-1">
                <span>Progress: {Math.round(((currentPage + 1) / totalPages) * 100)}%</span>
                <span>Reading time: {formatTime(readingTime)}</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-2">
                <div 
                  className="bg-white h-2 rounded-full transition-all duration-300"
                  style={{ width: `${((currentPage + 1) / totalPages) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </>
      )}

      {/* Search Panel */}
      {showSearch && (
        <div className="absolute top-16 right-4 w-80 bg-white rounded-lg shadow-lg border z-30 max-h-96 overflow-hidden">
          <div className="p-4 border-b">
            <div className="relative">
              <input
                type="text"
                placeholder="Search in book..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  searchInBook(e.target.value);
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
                  onClick={() => {
                    goToPage(result.pageIndex);
                    setShowSearch(false);
                  }}
                  className="w-full p-3 text-left hover:bg-gray-50 border-b last:border-b-0"
                >
                  <div className="text-sm font-medium text-gray-900">
                    Page {result.pageNumber} - {result.chapterTitle}
                  </div>
                  <div className="text-xs text-gray-600 mt-1 line-clamp-2">
                    ...{result.excerpt}...
                  </div>
                </button>
              ))}
            </div>
          )}
          
          {searchQuery && searchResults.length === 0 && (
            <div className="p-4 text-center text-gray-500">
              No results found
            </div>
          )}
        </div>
      )}

      {/* Table of Contents */}
      {showTableOfContents && (
        <div className="absolute top-16 left-4 w-80 bg-white rounded-lg shadow-lg border z-30 max-h-96 overflow-hidden">
          <div className="p-4 border-b">
            <h3 className="font-semibold text-gray-900">Table of Contents</h3>
          </div>
          <div className="max-h-64 overflow-y-auto">
            {chapters.map((chapter, index) => {
              const chapterFirstPage = pages.findIndex(page => page.chapterId === chapter.id);
              return (
                <button
                  key={chapter.id}
                  onClick={() => {
                    goToPage(chapterFirstPage);
                    setShowTableOfContents(false);
                  }}
                  className="w-full p-3 text-left hover:bg-gray-50 border-b last:border-b-0"
                >
                  <div className="text-sm font-medium text-gray-900">
                    {index + 1}. {chapter.title}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Page {chapterFirstPage + 1}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Bookmarks Panel */}
      {showBookmarks && (
        <div className="absolute top-16 right-4 w-80 bg-white rounded-lg shadow-lg border z-30 max-h-96 overflow-hidden">
          <div className="p-4 border-b">
            <h3 className="font-semibold text-gray-900">Bookmarks ({bookmarks.length})</h3>
          </div>
          <div className="max-h-64 overflow-y-auto">
            {bookmarks.length > 0 ? (
              bookmarks.map((bookmark) => (
                <button
                  key={bookmark.id}
                  onClick={() => {
                    goToPage(bookmark.pageNumber - 1);
                    setShowBookmarks(false);
                  }}
                  className="w-full p-3 text-left hover:bg-gray-50 border-b last:border-b-0"
                >
                  <div className="text-sm font-medium text-gray-900">
                    Page {bookmark.pageNumber} - {bookmark.chapterTitle}
                  </div>
                  <div className="text-xs text-gray-600 mt-1 line-clamp-2">
                    {bookmark.content}
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    {new Date(bookmark.timestamp).toLocaleDateString()}
                  </div>
                </button>
              ))
            ) : (
              <div className="p-4 text-center text-gray-500">
                No bookmarks yet
              </div>
            )}
          </div>
        </div>
      )}

      {/* Settings Panel */}
      {showSettings && (
        <div className="absolute top-16 right-4 w-80 bg-white rounded-lg shadow-lg border z-30 max-h-96 overflow-y-auto">
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
                    className={`flex-1 p-2 rounded-lg border text-xs flex items-center justify-center space-x-1 ${
                      settings.theme === value ? 'bg-blue-100 border-blue-500' : 'border-gray-300'
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
                  className="p-1 border rounded"
                >
                  <Minus className="h-3 w-3" />
                </button>
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full"
                    style={{ width: `${((settings.fontSize - 12) / 12) * 100}%` }}
                  />
                </div>
                <button
                  onClick={() => setSettings(prev => ({ 
                    ...prev, 
                    fontSize: Math.min(24, prev.fontSize + 2) 
                  }))}
                  className="p-1 border rounded"
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
                className="w-full p-2 border rounded-lg text-sm"
              >
                <option value="serif">Serif</option>
                <option value="sans-serif">Sans Serif</option>
                <option value="monospace">Monospace</option>
              </select>
            </div>

            {/* Auto Reading */}
            {speechSynthesis && (
              <div>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={settings.autoPlay}
                    onChange={(e) => setSettings(prev => ({ ...prev, autoPlay: e.target.checked }))}
                    className="rounded"
                  />
                  <span className="text-sm font-medium text-gray-700">Auto-advance pages</span>
                </label>
                
                <div className="mt-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Reading Speed: {settings.readingSpeed} WPM
                  </label>
                  <input
                    type="range"
                    min="150"
                    max="400"
                    value={settings.readingSpeed}
                    onChange={(e) => setSettings(prev => ({ ...prev, readingSpeed: parseInt(e.target.value) }))}
                    className="w-full"
                  />
                </div>

                {voices.length > 0 && (
                  <div className="mt-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Voice</label>
                    <select
                      value={selectedVoice}
                      onChange={(e) => setSelectedVoice(parseInt(e.target.value))}
                      className="w-full p-2 border rounded text-sm"
                    >
                      {voices.map((voice, index) => (
                        <option key={index} value={index}>
                          {voice.name} ({voice.lang})
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Reading Statistics Overlay */}
      <div className="absolute top-20 left-4 bg-black/50 text-white rounded-lg p-3 text-xs backdrop-blur-sm">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            <Clock className="h-3 w-3" />
            <span>{formatTime(readingTime)}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Type className="h-3 w-3" />
            <span>{Math.round(wordsRead)} words</span>
          </div>
          <div className="flex items-center space-x-1">
            <MapPin className="h-3 w-3" />
            <span>{currentPageData?.chapterTitle}</span>
          </div>
        </div>
      </div>

      {/* CSS for 3D flip effects */}
      <style jsx>{`
        .rotate-y-180 {
          transform: perspective(1200px) rotateY(-180deg);
        }
        
        .-rotate-y-180 {
          transform: perspective(1200px) rotateY(180deg);
        }
        
        .preserve-3d {
          transform-style: preserve-3d;
        }
        
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        /* Custom scrollbar for reading content */
        .overflow-y-auto::-webkit-scrollbar {
          width: 4px;
        }
        
        .overflow-y-auto::-webkit-scrollbar-track {
          background: #f1f1f1;
        }
        
        .overflow-y-auto::-webkit-scrollbar-thumb {
          background: #888;
          border-radius: 2px;
        }
        
        .overflow-y-auto::-webkit-scrollbar-thumb:hover {
          background: #555;
        }
      `}</style>
    </div>
  );
};

export default BookReader;