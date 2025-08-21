'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { 
  BookOpen, 
  FileText, 
  Plus, 
  Search, 
  Filter, 
  Grid3X3, 
  List, 
  Clock, 
  User, 
  Calendar,
  Edit3,
  Trash2,
  Copy,
  Download,
  Share2,
  MoreVertical,
  Star,
  Eye,
  Settings,
  Save,
  Undo,
  Redo,
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Link,
  Image,
  Code,
  Quote,
  Hash,
  Type,
  Palette,
  Layout,
  Sidebar,
  Monitor,
  Smartphone,
  Tablet,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  PlayCircle,
  Pause,
  ChevronDown,
  ChevronRight,
  FolderOpen,
  File,
  Archive,
  Database
} from 'lucide-react';

// Sample data for editor
const sampleBooks = [
  {
    id: 'ds-fundamentals',
    title: 'Data Science Fundamentals',
    subtitle: 'Complete Guide to Data Analysis',
    status: 'editing',
    lastModified: '2024-08-20T10:30:00Z',
    author: 'Dr. Sarah Chen',
    chapters: 6,
    pages: 234,
    words: 45680,
    estimatedTime: '8 hours',
    progress: 78,
    thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=300&h=400&fit=crop',
    tags: ['data science', 'machine learning', 'python'],
    created: '2024-08-15T09:00:00Z',
    language: 'English',
    difficulty: 'intermediate'
  },
  {
    id: 'web-dev-basics',
    title: 'Modern Web Development',
    subtitle: 'React, Next.js, and Beyond',
    status: 'draft',
    lastModified: '2024-08-19T14:20:00Z',
    author: 'Alex Rodriguez',
    chapters: 4,
    pages: 156,
    words: 32100,
    estimatedTime: '5 hours',
    progress: 45,
    thumbnail: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=300&h=400&fit=crop',
    tags: ['web development', 'react', 'javascript'],
    created: '2024-08-10T11:00:00Z',
    language: 'English',
    difficulty: 'beginner'
  },
  {
    id: 'ai-ethics',
    title: 'AI Ethics and Society',
    subtitle: 'Responsible AI Development',
    status: 'review',
    lastModified: '2024-08-18T16:45:00Z',
    author: 'Dr. Maria Santos',
    chapters: 8,
    pages: 298,
    words: 67890,
    estimatedTime: '12 hours',
    progress: 92,
    thumbnail: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=300&h=400&fit=crop',
    tags: ['ai ethics', 'philosophy', 'technology'],
    created: '2024-07-28T08:30:00Z',
    language: 'English',
    difficulty: 'advanced'
  },
  {
    id: 'mobile-design',
    title: 'Mobile UI/UX Design Principles',
    subtitle: 'Creating Intuitive Mobile Experiences',
    status: 'published',
    lastModified: '2024-08-16T12:15:00Z',
    author: 'Jessica Kim',
    chapters: 5,
    pages: 189,
    words: 38750,
    estimatedTime: '6 hours',
    progress: 100,
    thumbnail: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=300&h=400&fit=crop',
    tags: ['ui design', 'ux design', 'mobile'],
    created: '2024-08-01T10:00:00Z',
    language: 'English',
    difficulty: 'intermediate'
  }
];

const statusConfig = {
  draft: { 
    label: 'Draft', 
    color: 'bg-gray-100 text-gray-800', 
    icon: Edit3,
    description: 'Work in progress'
  },
  editing: { 
    label: 'Editing', 
    color: 'bg-blue-100 text-blue-800', 
    icon: Edit3,
    description: 'Currently being edited'
  },
  review: { 
    label: 'In Review', 
    color: 'bg-yellow-100 text-yellow-800', 
    icon: Eye,
    description: 'Under review process'
  },
  published: { 
    label: 'Published', 
    color: 'bg-green-100 text-green-800', 
    icon: CheckCircle,
    description: 'Live and available'
  }
};

const difficultyConfig = {
  beginner: { label: 'Beginner', color: 'text-green-600', dots: 1 },
  intermediate: { label: 'Intermediate', color: 'text-yellow-600', dots: 2 },
  advanced: { label: 'Advanced', color: 'text-red-600', dots: 3 }
};

const EditorMainPage = () => {
  const router = useRouter();
  
  // State management
  const [books, setBooks] = useState(sampleBooks);
  const [filteredBooks, setFilteredBooks] = useState(sampleBooks);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [sortBy, setSortBy] = useState('lastModified'); // 'lastModified' | 'title' | 'created' | 'progress'
  const [sortOrder, setSortOrder] = useState('desc'); // 'asc' | 'desc'
  const [selectedBooks, setSelectedBooks] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  
  // Refs
  const dropdownRef = useRef(null);

  // Filter and sort books
  useEffect(() => {
    let filtered = books.filter(book => {
      const matchesSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           book.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           book.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesStatus = selectedStatus === 'all' || book.status === selectedStatus;
      const matchesDifficulty = selectedDifficulty === 'all' || book.difficulty === selectedDifficulty;
      
      return matchesSearch && matchesStatus && matchesDifficulty;
    });

    // Sort books
    filtered.sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];
      
      if (sortBy === 'lastModified' || sortBy === 'created') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }
      
      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredBooks(filtered);
  }, [books, searchQuery, selectedStatus, selectedDifficulty, sortBy, sortOrder]);

  // Handle click outside for dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Utility functions
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
    if (days < 365) return `${Math.floor(days / 30)} months ago`;
    return `${Math.floor(days / 365)} years ago`;
  };

  const formatReadingTime = (timeString) => {
    return timeString;
  };

  const getProgressColor = (progress) => {
    if (progress < 30) return 'bg-red-500';
    if (progress < 70) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  // Action handlers
  const handleCreateNew = () => {
    router.push('/create-book');
  };

  const handleEditBook = (bookId) => {
    router.push(`/editor/${bookId}`);
  };

  const handleViewBook = (bookId) => {
    router.push(`/books/${bookId}`);
  };

  const handleDuplicateBook = (bookId) => {
    const book = books.find(b => b.id === bookId);
    if (book) {
      const duplicatedBook = {
        ...book,
        id: `${book.id}-copy-${Date.now()}`,
        title: `${book.title} (Copy)`,
        status: 'draft',
        progress: 0,
        lastModified: new Date().toISOString(),
        created: new Date().toISOString()
      };
      setBooks([duplicatedBook, ...books]);
    }
  };

  const handleDeleteBook = (bookId) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      setBooks(books.filter(b => b.id !== bookId));
      setSelectedBooks(selectedBooks.filter(id => id !== bookId));
    }
  };

  const handleBulkAction = (action) => {
    switch (action) {
      case 'delete':
        if (window.confirm(`Are you sure you want to delete ${selectedBooks.length} books?`)) {
          setBooks(books.filter(b => !selectedBooks.includes(b.id)));
          setSelectedBooks([]);
        }
        break;
      case 'export':
        console.log('Exporting books:', selectedBooks);
        break;
      case 'archive':
        console.log('Archiving books:', selectedBooks);
        break;
      default:
        break;
    }
  };

  const toggleBookSelection = (bookId) => {
    setSelectedBooks(prev => 
      prev.includes(bookId) 
        ? prev.filter(id => id !== bookId)
        : [...prev, bookId]
    );
  };

  const toggleSelectAll = () => {
    setSelectedBooks(
      selectedBooks.length === filteredBooks.length 
        ? [] 
        : filteredBooks.map(book => book.id)
    );
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedStatus('all');
    setSelectedDifficulty('all');
    setSortBy('lastModified');
    setSortOrder('desc');
  };

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Toolbar */}
        <div className="flex items-center justify-between mb-6">
          {/* Left - Filters and View Controls */}
          <div className="flex items-center space-x-4">
            {/* Bulk Actions */}
            {selectedBooks.length > 0 && (
              <div className="flex items-center space-x-2 bg-blue-50 border border-blue-200 rounded-lg px-3 py-2">
                <span className="text-sm font-medium text-blue-700">
                  {selectedBooks.length} selected
                </span>
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => handleBulkAction('export')}
                    className="p-1 text-blue-600 hover:text-blue-700"
                    title="Export selected"
                  >
                    <Download className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleBulkAction('archive')}
                    className="p-1 text-blue-600 hover:text-blue-700"
                    title="Archive selected"
                  >
                    <Archive className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleBulkAction('delete')}
                    className="p-1 text-red-600 hover:text-red-700"
                    title="Delete selected"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Filters */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg border transition-colors ${
                  showFilters 
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-700' 
                    : 'bg-white border-gray-300 hover:bg-gray-50'
                }`}
              >
                <Filter className="h-4 w-4" />
                <span>Filters</span>
                {(selectedStatus !== 'all' || selectedDifficulty !== 'all') && (
                  <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                )}
              </button>

              {/* Quick Filter Buttons */}
              <div className="flex items-center space-x-1">
                {Object.entries(statusConfig).map(([status, config]) => {
                  const count = books.filter(book => book.status === status).length;
                  return (
                    <button
                      key={status}
                      onClick={() => setSelectedStatus(selectedStatus === status ? 'all' : status)}
                      className={`px-3 py-1 rounded-full text-sm transition-colors ${
                        selectedStatus === status
                          ? config.color
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {config.label} ({count})
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right - View and Sort Controls */}
          <div className="flex items-center space-x-4">
            {/* Sort */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setActiveDropdown(activeDropdown === 'sort' ? null : 'sort')}
                className="flex items-center space-x-2 px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <span className="text-sm">Sort: {sortBy === 'lastModified' ? 'Last Modified' : sortBy}</span>
                <ChevronDown className="h-4 w-4" />
              </button>
              
              {activeDropdown === 'sort' && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                  <div className="py-1">
                    {[
                      { key: 'lastModified', label: 'Last Modified' },
                      { key: 'title', label: 'Title' },
                      { key: 'created', label: 'Created Date' },
                      { key: 'progress', label: 'Progress' }
                    ].map(({ key, label }) => (
                      <button
                        key={key}
                        onClick={() => {
                          setSortBy(key);
                          setActiveDropdown(null);
                        }}
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${
                          sortBy === key ? 'bg-emerald-50 text-emerald-700' : 'text-gray-700'
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                    <div className="border-t border-gray-100 my-1"></div>
                    <button
                      onClick={() => {
                        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                        setActiveDropdown(null);
                      }}
                      className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 text-gray-700"
                    >
                      {sortOrder === 'asc' ? '↑ Ascending' : '↓ Descending'}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* View Mode */}
            <div className="flex items-center bg-white border border-gray-300 rounded-lg">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-l-lg transition-colors ${
                  viewMode === 'grid' 
                    ? 'bg-emerald-100 text-emerald-700' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Grid3X3 className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-r-lg transition-colors ${
                  viewMode === 'list' 
                    ? 'bg-emerald-100 text-emerald-700' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Advanced Filters Panel */}
        {showFilters && (
          <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">Advanced Filters</h3>
              <button
                onClick={clearFilters}
                className="text-sm text-emerald-600 hover:text-emerald-700"
              >
                Clear All
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Status Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                >
                  <option value="all">All Status</option>
                  {Object.entries(statusConfig).map(([status, config]) => (
                    <option key={status} value={status}>
                      {config.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Difficulty Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
                <select
                  value={selectedDifficulty}
                  onChange={(e) => setSelectedDifficulty(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                >
                  <option value="all">All Levels</option>
                  {Object.entries(difficultyConfig).map(([difficulty, config]) => (
                    <option key={difficulty} value={difficulty}>
                      {config.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Date Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Created</label>
                <select className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500">
                  <option value="all">All Time</option>
                  <option value="today">Today</option>
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                  <option value="year">This Year</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Results Summary */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <p className="text-sm text-gray-600">
              Showing {filteredBooks.length} of {books.length} books
            </p>
            {selectedBooks.length > 0 && (
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={selectedBooks.length === filteredBooks.length}
                  onChange={toggleSelectAll}
                  className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                />
                <span className="text-sm text-gray-600">Select All</span>
              </div>
            )}
          </div>
        </div>

        {/* Books Display */}
        {filteredBooks.length === 0 ? (
          <div className="text-center py-12">
            <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <BookOpen className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No books found</h3>
            <p className="text-gray-500 mb-6">
              {searchQuery ? 'Try adjusting your search or filters.' : 'Create your first book to get started.'}
            </p>
            <button
              onClick={handleCreateNew}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg inline-flex items-center space-x-2 transition-colors"
            >
              <Plus className="h-5 w-5" />
              <span>Create New Book</span>
            </button>
          </div>
        ) : (
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' : 'space-y-4'}>
            {filteredBooks.map((book) => (
              viewMode === 'grid' ? (
                // Grid View
                <div
                  key={book.id}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300 group"
                >
                  {/* Selection Checkbox */}
                  <div className="absolute top-4 left-4 z-10">
                    <input
                      type="checkbox"
                      checked={selectedBooks.includes(book.id)}
                      onChange={() => toggleBookSelection(book.id)}
                      className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                    />
                  </div>

                  {/* Book Cover */}
                  <div className="relative h-48 bg-gradient-to-br from-emerald-400 to-teal-600 rounded-t-xl overflow-hidden">
                    <img
                      src={book.thumbnail}
                      alt={book.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-10 transition-all duration-300"></div>
                    
                    {/* Status Badge */}
                    <div className="absolute top-4 right-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusConfig[book.status].color}`}>
                        {statusConfig[book.status].label}
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-black bg-opacity-20">
                      <div 
                        className={`h-full ${getProgressColor(book.progress)} transition-all duration-300`}
                        style={{ width: `${book.progress}%` }}
                      />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <div className="mb-3">
                      <h3 className="font-semibold text-gray-900 text-lg mb-1 line-clamp-1">
                        {book.title}
                      </h3>
                      <p className="text-sm text-gray-600 line-clamp-1">
                        {book.subtitle}
                      </p>
                    </div>

                    <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                      <span className="flex items-center">
                        <User className="h-4 w-4 mr-1" />
                        {book.author}
                      </span>
                      <span className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {formatReadingTime(book.estimatedTime)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <span>{book.chapters} chapters</span>
                      <span>{book.pages} pages</span>
                      <span>{book.words.toLocaleString()} words</span>
                    </div>

                    {/* Difficulty */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-1">
                        {Array.from({ length: 3 }).map((_, i) => (
                          <div
                            key={i}
                            className={`w-2 h-2 rounded-full ${
                              i < difficultyConfig[book.difficulty].dots
                                ? difficultyConfig[book.difficulty].color.replace('text-', 'bg-')
                                : 'bg-gray-200'
                            }`}
                          />
                        ))}
                        <span className={`text-xs font-medium ${difficultyConfig[book.difficulty].color}`}>
                          {difficultyConfig[book.difficulty].label}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500">
                        {formatDate(book.lastModified)}
                      </span>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1 mb-4">
                      {book.tags.slice(0, 2).map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                      {book.tags.length > 2 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                          +{book.tags.length - 2}
                        </span>
                      )}
                    </div>

                    {/* Progress */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-gray-600">Progress</span>
                        <span className="font-medium">{book.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${getProgressColor(book.progress)} transition-all duration-300`}
                          style={{ width: `${book.progress}%` }}
                        />
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleEditBook(book.id)}
                        className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleViewBook(book.id)}
                        className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <div className="relative">
                        <button
                          onClick={() => setActiveDropdown(activeDropdown === `actions-${book.id}` ? null : `actions-${book.id}`)}
                          className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </button>
                        
                        {activeDropdown === `actions-${book.id}` && (
                          <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                            <div className="py-1">
                              <button
                                onClick={() => {
                                  handleDuplicateBook(book.id);
                                  setActiveDropdown(null);
                                }}
                                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                              >
                                <Copy className="h-4 w-4" />
                                <span>Duplicate</span>
                              </button>
                              <button
                                onClick={() => {
                                  console.log('Export book:', book.id);
                                  setActiveDropdown(null);
                                }}
                                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                              >
                                <Download className="h-4 w-4" />
                                <span>Export</span>
                              </button>
                              <button
                                onClick={() => {
                                  console.log('Share book:', book.id);
                                  setActiveDropdown(null);
                                }}
                                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                              >
                                <Share2 className="h-4 w-4" />
                                <span>Share</span>
                              </button>
                              <div className="border-t border-gray-100 my-1"></div>
                              <button
                                onClick={() => {
                                  handleDeleteBook(book.id);
                                  setActiveDropdown(null);
                                }}
                                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                              >
                                <Trash2 className="h-4 w-4" />
                                <span>Delete</span>
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                // List View
                <div
                  key={book.id}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200"
                >
                  <div className="p-6">
                    <div className="flex items-center space-x-4">
                      {/* Selection Checkbox */}
                      <input
                        type="checkbox"
                        checked={selectedBooks.includes(book.id)}
                        onChange={() => toggleBookSelection(book.id)}
                        className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                      />

                      {/* Book Thumbnail */}
                      <div className="flex-shrink-0 w-16 h-20 bg-gradient-to-br from-emerald-400 to-teal-600 rounded-lg overflow-hidden">
                        <img
                          src={book.thumbnail}
                          alt={book.title}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Book Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-3 mb-1">
                              <h3 className="text-lg font-semibold text-gray-900 truncate">
                                {book.title}
                              </h3>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusConfig[book.status].color}`}>
                                {statusConfig[book.status].label}
                              </span>
                            </div>
                            <p className="text-gray-600 text-sm mb-2 truncate">
                              {book.subtitle}
                            </p>
                            <div className="flex items-center space-x-6 text-sm text-gray-500">
                              <span className="flex items-center">
                                <User className="h-4 w-4 mr-1" />
                                {book.author}
                              </span>
                              <span className="flex items-center">
                                <FileText className="h-4 w-4 mr-1" />
                                {book.chapters} chapters
                              </span>
                              <span className="flex items-center">
                                <Clock className="h-4 w-4 mr-1" />
                                {formatReadingTime(book.estimatedTime)}
                              </span>
                              <span className="flex items-center">
                                <Calendar className="h-4 w-4 mr-1" />
                                {formatDate(book.lastModified)}
                              </span>
                            </div>
                          </div>

                          {/* Progress and Actions */}
                          <div className="flex items-center space-x-6 ml-4">
                            {/* Progress */}
                            <div className="text-center">
                              <div className="text-sm font-medium text-gray-900 mb-1">
                                {book.progress}%
                              </div>
                              <div className="w-16 bg-gray-200 rounded-full h-2">
                                <div 
                                  className={`h-2 rounded-full ${getProgressColor(book.progress)} transition-all duration-300`}
                                  style={{ width: `${book.progress}%` }}
                                />
                              </div>
                            </div>

                            {/* Difficulty */}
                            <div className="flex items-center space-x-1">
                              {Array.from({ length: 3 }).map((_, i) => (
                                <div
                                  key={i}
                                  className={`w-2 h-2 rounded-full ${
                                    i < difficultyConfig[book.difficulty].dots
                                      ? difficultyConfig[book.difficulty].color.replace('text-', 'bg-')
                                      : 'bg-gray-200'
                                  }`}
                                />
                              ))}
                            </div>

                            {/* Actions */}
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => handleEditBook(book.id)}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleViewBook(book.id)}
                                className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                              >
                                <Eye className="h-4 w-4" />
                              </button>
                              <div className="relative">
                                <button
                                  onClick={() => setActiveDropdown(activeDropdown === `actions-list-${book.id}` ? null : `actions-list-${book.id}`)}
                                  className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                  <MoreVertical className="h-4 w-4" />
                                </button>
                                
                                {activeDropdown === `actions-list-${book.id}` && (
                                  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                                    <div className="py-1">
                                      <button
                                        onClick={() => {
                                          handleDuplicateBook(book.id);
                                          setActiveDropdown(null);
                                        }}
                                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                                      >
                                        <Copy className="h-4 w-4" />
                                        <span>Duplicate</span>
                                      </button>
                                      <button
                                        onClick={() => {
                                          console.log('Export book:', book.id);
                                          setActiveDropdown(null);
                                        }}
                                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                                      >
                                        <Download className="h-4 w-4" />
                                        <span>Export</span>
                                      </button>
                                      <button
                                        onClick={() => {
                                          console.log('Share book:', book.id);
                                          setActiveDropdown(null);
                                        }}
                                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                                      >
                                        <Share2 className="h-4 w-4" />
                                        <span>Share</span>
                                      </button>
                                      <div className="border-t border-gray-100 my-1"></div>
                                      <button
                                        onClick={() => {
                                          handleDeleteBook(book.id);
                                          setActiveDropdown(null);
                                        }}
                                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                                      >
                                        <Trash2 className="h-4 w-4" />
                                        <span>Delete</span>
                                      </button>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-1 mt-3">
                          {book.tags.map((tag) => (
                            <span
                              key={tag}
                              className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            ))}
          </div>
        )}

        {/* Load More Button (for pagination) */}
        {filteredBooks.length > 0 && filteredBooks.length >= 12 && (
          <div className="text-center mt-8">
            <button className="bg-white border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors inline-flex items-center space-x-2">
              <RefreshCw className="h-4 w-4" />
              <span>Load More Books</span>
            </button>
          </div>
        )}
      </div>

      {/* Quick Stats Sidebar (Optional) */}
      <div className="fixed bottom-6 right-6 bg-white border border-gray-200 rounded-lg shadow-lg p-4 w-64 hidden xl:block">
        <h3 className="font-semibold text-gray-900 mb-3">Quick Stats</h3>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Total Books</span>
            <span className="font-medium">{books.length}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">In Progress</span>
            <span className="font-medium">
              {books.filter(book => book.status === 'editing' || book.status === 'draft').length}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Published</span>
            <span className="font-medium">
              {books.filter(book => book.status === 'published').length}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Total Pages</span>
            <span className="font-medium">
              {books.reduce((sum, book) => sum + book.pages, 0).toLocaleString()}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Total Words</span>
            <span className="font-medium">
              {books.reduce((sum, book) => sum + book.words, 0).toLocaleString()}
            </span>
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="text-xs text-gray-500 mb-2">Average Progress</div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="h-2 bg-emerald-500 rounded-full transition-all duration-300"
              style={{ 
                width: `${books.reduce((sum, book) => sum + book.progress, 0) / books.length}%` 
              }}
            />
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {Math.round(books.reduce((sum, book) => sum + book.progress, 0) / books.length)}% complete
          </div>
        </div>
      </div>

      {/* Floating Action Button for Mobile */}
      <div className="fixed bottom-6 right-6 xl:hidden">
        <button
          onClick={handleCreateNew}
          className="bg-emerald-600 hover:bg-emerald-700 text-white p-4 rounded-full shadow-lg transition-colors"
        >
          <Plus className="h-6 w-6" />
        </button>
      </div>
    </div>
  );
};

export default EditorMainPage;
