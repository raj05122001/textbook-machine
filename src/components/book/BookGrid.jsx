'use client';

import { useState, useEffect, useMemo } from 'react';
import BookCard from './BookCard';
import { 
  Grid3X3, 
  List, 
  Search, 
  Filter, 
  Sort, 
  ChevronDown, 
  LayoutGrid,
  BookOpen,
  Plus,
  X,
  ArrowUpDown,
  Calendar,
  User,
  FileText,
  Clock,
  Star,
  Eye,
  Download,
  Settings,
  CheckSquare,
  Square,
  RefreshCw,
  SortAsc,
  SortDesc,
  Trash2,
  Edit3,
  Share2,
  Archive,
  Tag,
  Bookmark,
  TrendingUp,
  BarChart3,
  PieChart,
  Activity
} from 'lucide-react';

const BookGrid = ({
  books = [],
  onBookSelect,
  onBookEdit,
  onBookDelete,
  onBookDownload,
  onBookShare,
  onBookRead,
  onBookBookmark,
  onCreateNew,
  onBulkDelete,
  onBulkDownload,
  onBulkArchive,
  loading = false,
  emptyState = null,
  showStats = true,
  showFilters = true,
  showBulkActions = true,
  defaultView = 'grid',
  defaultSort = 'lastModified',
  className = ''
}) => {
  const [viewMode, setViewMode] = useState(defaultView); // 'grid', 'list', 'compact'
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState(defaultSort);
  const [sortOrder, setSortOrder] = useState('desc');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterAuthor, setFilterAuthor] = useState('all');
  const [filterTag, setFilterTag] = useState('all');
  const [showFiltersPanel, setShowFiltersPanel] = useState(false);
  const [selectedBooks, setSelectedBooks] = useState(new Set());
  const [cardSize, setCardSize] = useState('medium');
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [currentPage, setCurrentPage] = useState(1);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [showBulkMenu, setShowBulkMenu] = useState(false);
  const [lastSelectedIndex, setLastSelectedIndex] = useState(-1);

  // Advanced filters
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [wordCountRange, setWordCountRange] = useState({ min: '', max: '' });
  const [ratingFilter, setRatingFilter] = useState(0);
  const [progressFilter, setProgressFilter] = useState('all'); // 'all', 'unread', 'reading', 'completed'

  // Real-time search debouncing
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Filter and sort books
  const filteredAndSortedBooks = useMemo(() => {
    let filtered = [...books];

    // Apply search filter
    if (debouncedSearchQuery) {
      const query = debouncedSearchQuery.toLowerCase();
      filtered = filtered.filter(book =>
        book.title.toLowerCase().includes(query) ||
        book.description?.toLowerCase().includes(query) ||
        book.author?.toLowerCase().includes(query) ||
        book.tags?.some(tag => tag.toLowerCase().includes(query)) ||
        book.content?.toLowerCase().includes(query)
      );
    }

    // Apply status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter(book => book.status === filterStatus);
    }

    // Apply author filter
    if (filterAuthor !== 'all') {
      filtered = filtered.filter(book => book.author === filterAuthor);
    }

    // Apply tag filter
    if (filterTag !== 'all') {
      filtered = filtered.filter(book => book.tags?.includes(filterTag));
    }

    // Apply date range filter
    if (dateRange.start || dateRange.end) {
      filtered = filtered.filter(book => {
        const bookDate = new Date(book.lastModified || book.createdAt);
        const startDate = dateRange.start ? new Date(dateRange.start) : new Date(0);
        const endDate = dateRange.end ? new Date(dateRange.end) : new Date();
        return bookDate >= startDate && bookDate <= endDate;
      });
    }

    // Apply word count filter
    if (wordCountRange.min || wordCountRange.max) {
      filtered = filtered.filter(book => {
        const wordCount = book.wordCount || 0;
        const min = wordCountRange.min ? parseInt(wordCountRange.min) : 0;
        const max = wordCountRange.max ? parseInt(wordCountRange.max) : Infinity;
        return wordCount >= min && wordCount <= max;
      });
    }

    // Apply rating filter
    if (ratingFilter > 0) {
      filtered = filtered.filter(book => (book.rating || 0) >= ratingFilter);
    }

    // Apply progress filter
    if (progressFilter !== 'all') {
      filtered = filtered.filter(book => {
        const progress = book.readingProgress || 0;
        switch (progressFilter) {
          case 'unread': return progress === 0;
          case 'reading': return progress > 0 && progress < 100;
          case 'completed': return progress >= 100;
          default: return true;
        }
      });
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue, bValue;

      switch (sortBy) {
        case 'title':
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
          break;
        case 'author':
          aValue = a.author?.toLowerCase() || '';
          bValue = b.author?.toLowerCase() || '';
          break;
        case 'lastModified':
          aValue = new Date(a.lastModified || a.createdAt || 0);
          bValue = new Date(b.lastModified || b.createdAt || 0);
          break;
        case 'createdAt':
          aValue = new Date(a.createdAt || 0);
          bValue = new Date(b.createdAt || 0);
          break;
        case 'wordCount':
          aValue = a.wordCount || 0;
          bValue = b.wordCount || 0;
          break;
        case 'rating':
          aValue = a.rating || 0;
          bValue = b.rating || 0;
          break;
        case 'readingProgress':
          aValue = a.readingProgress || 0;
          bValue = b.readingProgress || 0;
          break;
        case 'chapters':
          aValue = a.chapters || 0;
          bValue = b.chapters || 0;
          break;
        default:
          aValue = a.createdAt || 0;
          bValue = b.createdAt || 0;
      }

      if (sortOrder === 'desc') {
        [aValue, bValue] = [bValue, aValue];
      }

      if (typeof aValue === 'string') {
        return aValue.localeCompare(bValue);
      }
      return aValue - bValue;
    });

    return filtered;
  }, [books, debouncedSearchQuery, sortBy, sortOrder, filterStatus, filterAuthor, filterTag, dateRange, wordCountRange, ratingFilter, progressFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedBooks.length / itemsPerPage);
  const paginatedBooks = filteredAndSortedBooks.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Get unique values for filters
  const uniqueAuthors = useMemo(() => {
    const authors = books.map(book => book.author).filter(Boolean);
    return [...new Set(authors)].sort();
  }, [books]);

  const uniqueTags = useMemo(() => {
    const tags = books.flatMap(book => book.tags || []);
    return [...new Set(tags)].sort();
  }, [books]);

  // Get book statistics
  const bookStats = useMemo(() => {
    const totalWords = books.reduce((sum, book) => sum + (book.wordCount || 0), 0);
    const totalChapters = books.reduce((sum, book) => sum + (book.chapters || 0), 0);
    const completedBooks = books.filter(book => book.status === 'completed').length;
    const inProgressBooks = books.filter(book => book.status === 'in-progress').length;
    const draftBooks = books.filter(book => book.status === 'draft').length;
    const publishedBooks = books.filter(book => book.status === 'published').length;
    const averageRating = books.reduce((sum, book) => sum + (book.rating || 0), 0) / books.length || 0;
    const averageProgress = books.reduce((sum, book) => sum + (book.readingProgress || 0), 0) / books.length || 0;
    
    return {
      total: books.length,
      totalWords,
      totalChapters,
      completed: completedBooks,
      inProgress: inProgressBooks,
      draft: draftBooks,
      published: publishedBooks,
      averageRating,
      averageProgress,
      estimatedReadingTime: Math.ceil(totalWords / 200) // 200 words per minute
    };
  }, [books]);

  // Selection handlers
  const handleBookSelect = (book, index, event) => {
    if (isSelectionMode || event?.ctrlKey || event?.metaKey) {
      event?.preventDefault();
      const newSelected = new Set(selectedBooks);
      
      if (event?.shiftKey && lastSelectedIndex !== -1) {
        // Range selection
        const start = Math.min(lastSelectedIndex, index);
        const end = Math.max(lastSelectedIndex, index);
        for (let i = start; i <= end; i++) {
          if (paginatedBooks[i]) {
            newSelected.add(paginatedBooks[i].id);
          }
        }
      } else {
        // Single selection toggle
        if (newSelected.has(book.id)) {
          newSelected.delete(book.id);
        } else {
          newSelected.add(book.id);
        }
        setLastSelectedIndex(index);
      }
      
      setSelectedBooks(newSelected);
      
      if (newSelected.size === 0) {
        setIsSelectionMode(false);
      }
    } else {
      onBookSelect?.(book);
    }
  };

  const selectAllBooks = () => {
    const allIds = new Set(paginatedBooks.map(book => book.id));
    setSelectedBooks(allIds);
    setIsSelectionMode(true);
  };

  const deselectAllBooks = () => {
    setSelectedBooks(new Set());
    setIsSelectionMode(false);
  };

  const handleBulkAction = (action) => {
    const selectedBookIds = Array.from(selectedBooks);
    const selectedBookObjects = books.filter(book => selectedBooks.has(book.id));
    
    switch (action) {
      case 'delete':
        onBulkDelete?.(selectedBookIds);
        break;
      case 'download':
        onBulkDownload?.(selectedBookObjects);
        break;
      case 'archive':
        onBulkArchive?.(selectedBookIds);
        break;
      case 'export':
        // Handle bulk export
        console.log('Bulk export:', selectedBookIds);
        break;
    }
    
    setSelectedBooks(new Set());
    setIsSelectionMode(false);
    setShowBulkMenu(false);
  };

  const clearAllFilters = () => {
    setSearchQuery('');
    setFilterStatus('all');
    setFilterAuthor('all');
    setFilterTag('all');
    setDateRange({ start: '', end: '' });
    setWordCountRange({ min: '', max: '' });
    setRatingFilter(0);
    setProgressFilter('all');
    setSortBy(defaultSort);
    setSortOrder('desc');
    setCurrentPage(1);
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (searchQuery) count++;
    if (filterStatus !== 'all') count++;
    if (filterAuthor !== 'all') count++;
    if (filterTag !== 'all') count++;
    if (dateRange.start || dateRange.end) count++;
    if (wordCountRange.min || wordCountRange.max) count++;
    if (ratingFilter > 0) count++;
    if (progressFilter !== 'all') count++;
    return count;
  };

  const getGridClasses = () => {
    switch (viewMode) {
      case 'grid':
        return `grid gap-6 ${
          cardSize === 'small' ? 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6' :
          cardSize === 'medium' ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5' :
          'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
        }`;
      case 'list':
        return 'grid grid-cols-1 gap-4';
      case 'compact':
        return 'grid grid-cols-1 gap-2';
      default:
        return 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6';
    }
  };

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchQuery, filterStatus, filterAuthor, filterTag, dateRange, wordCountRange, ratingFilter, progressFilter]);

  if (loading) {
    return (
      <div className={`${className}`}>
        {/* Loading Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="h-8 bg-gray-200 rounded w-48 animate-pulse"></div>
          <div className="flex space-x-2">
            <div className="h-10 bg-gray-200 rounded w-20 animate-pulse"></div>
            <div className="h-10 bg-gray-200 rounded w-20 animate-pulse"></div>
          </div>
        </div>

        {/* Loading Stats */}
        {showStats && (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="bg-gray-200 rounded-lg p-4 animate-pulse">
                <div className="h-6 bg-gray-300 rounded w-12 mb-2"></div>
                <div className="h-4 bg-gray-300 rounded w-20"></div>
              </div>
            ))}
          </div>
        )}

        {/* Loading Grid */}
        <div className={getGridClasses()}>
          {[...Array(itemsPerPage)].map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="w-full h-72 bg-gray-200 rounded-lg mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`${className}`}>
      {/* Statistics Section */}
      {showStats && (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6">
          <div className="bg-white rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-gray-900">{bookStats.total}</div>
                <div className="text-sm text-gray-600">Total Books</div>
              </div>
              <BookOpen className="h-8 w-8 text-blue-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-green-600">{bookStats.completed}</div>
                <div className="text-sm text-gray-600">Completed</div>
              </div>
              <CheckSquare className="h-8 w-8 text-green-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-blue-600">{bookStats.inProgress}</div>
                <div className="text-sm text-gray-600">In Progress</div>
              </div>
              <Activity className="h-8 w-8 text-blue-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-yellow-600">{bookStats.draft}</div>
                <div className="text-sm text-gray-600">Drafts</div>
              </div>
              <Edit3 className="h-8 w-8 text-yellow-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-purple-600">{bookStats.totalWords.toLocaleString()}</div>
                <div className="text-sm text-gray-600">Total Words</div>
              </div>
              <FileText className="h-8 w-8 text-purple-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-orange-600">
                  {bookStats.averageRating.toFixed(1)}
                  <Star className="h-5 w-5 inline ml-1 fill-current" />
                </div>
                <div className="text-sm text-gray-600">Avg Rating</div>
              </div>
              <TrendingUp className="h-8 w-8 text-orange-500" />
            </div>
          </div>
        </div>
      )}

      {/* Header with Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 space-y-4 lg:space-y-0">
        {/* Left Side - Title and Quick Info */}
        <div className="flex items-center space-x-4">
          <h2 className="text-2xl font-bold text-gray-900">
            My Books
            {filteredAndSortedBooks.length !== books.length && (
              <span className="text-lg font-normal text-gray-500 ml-2">
                ({filteredAndSortedBooks.length} of {books.length})
              </span>
            )}
          </h2>
          
          {/* Active Filters Indicator */}
          {getActiveFiltersCount() > 0 && (
            <div className="flex items-center space-x-2">
              <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                {getActiveFiltersCount()} filter{getActiveFiltersCount() !== 1 ? 's' : ''} active
              </span>
              <button
                onClick={clearAllFilters}
                className="text-blue-600 hover:text-blue-700 text-sm"
              >
                Clear all
              </button>
            </div>
          )}
        </div>

        {/* Right Side - Actions */}
        <div className="flex items-center space-x-2">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search books..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Filters Toggle */}
          {showFilters && (
            <button
              onClick={() => setShowFiltersPanel(!showFiltersPanel)}
              className={`p-2 rounded-lg transition-colors ${
                showFiltersPanel ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              title="Advanced Filters"
            >
              <Filter className="h-4 w-4" />
            </button>
          )}

          {/* Selection Mode Toggle */}
          {showBulkActions && (
            <button
              onClick={() => {
                setIsSelectionMode(!isSelectionMode);
                if (isSelectionMode) {
                  setSelectedBooks(new Set());
                }
              }}
              className={`p-2 rounded-lg transition-colors ${
                isSelectionMode ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              title="Selection Mode"
            >
              {isSelectionMode ? <CheckSquare className="h-4 w-4" /> : <Square className="h-4 w-4" />}
            </button>
          )}

          {/* View Mode Toggle */}
          <div className="flex items-center bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'grid' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'
              }`}
              title="Grid View"
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'list' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'
              }`}
              title="List View"
            >
              <List className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('compact')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'compact' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'
              }`}
              title="Compact View"
            >
              <Grid3X3 className="h-4 w-4" />
            </button>
          </div>

          {/* Create New Button */}
          <button
            onClick={onCreateNew}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">New Book</span>
          </button>
        </div>
      </div>

      {/* Advanced Filters Panel */}
      {showFiltersPanel && (
        <div className="bg-gray-50 rounded-lg p-6 mb-6 border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {/* Sort Controls */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Sort By</label>
              <div className="flex">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-l-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="lastModified">Last Modified</option>
                  <option value="createdAt">Created Date</option>
                  <option value="title">Title</option>
                  <option value="author">Author</option>
                  <option value="wordCount">Word Count</option>
                  <option value="chapters">Chapters</option>
                  <option value="rating">Rating</option>
                  <option value="readingProgress">Reading Progress</option>
                </select>
                <button
                  onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                  className="px-3 py-2 border border-l-0 border-gray-300 rounded-r-lg hover:bg-gray-50 transition-colors"
                  title={`Sort ${sortOrder === 'asc' ? 'Descending' : 'Ascending'}`}
                >
                  {sortOrder === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Status Filter */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Status</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                <option value="draft">Draft</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="published">Published</option>
              </select>
            </div>

            {/* Author Filter */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Author</label>
              <select
                value={filterAuthor}
                onChange={(e) => setFilterAuthor(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Authors</option>
                {uniqueAuthors.map(author => (
                  <option key={author} value={author}>{author}</option>
                ))}
              </select>
            </div>

            {/* Tag Filter */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Tags</label>
              <select
                value={filterTag}
                onChange={(e) => setFilterTag(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Tags</option>
                {uniqueTags.map(tag => (
                  <option key={tag} value={tag}>{tag}</option>
                ))}
              </select>
            </div>

            {/* Date Range */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Date Range</label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="date"
                  value={dateRange.start}
                  onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Start date"
                />
                <input
                  type="date"
                  value={dateRange.end}
                  onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="End date"
                />
              </div>
            </div>

            {/* Word Count Range */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Word Count</label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  value={wordCountRange.min}
                  onChange={(e) => setWordCountRange(prev => ({ ...prev, max: e.target.value }))}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Max words"
                />
              </div>
            </div>

            {/* Rating Filter */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Minimum Rating</label>
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1">
                  {[1, 2, 3, 4, 5].map(rating => (
                    <button
                      key={rating}
                      onClick={() => setRatingFilter(rating === ratingFilter ? 0 : rating)}
                      className={`p-1 rounded transition-colors ${
                        rating <= ratingFilter ? 'text-yellow-500' : 'text-gray-300 hover:text-yellow-400'
                      }`}
                    >
                      <Star className="h-4 w-4 fill-current" />
                    </button>
                  ))}
                </div>
                {ratingFilter > 0 && (
                  <button
                    onClick={() => setRatingFilter(0)}
                    className="text-xs text-gray-500 hover:text-gray-700"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>

            {/* Reading Progress Filter */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Reading Progress</label>
              <select
                value={progressFilter}
                onChange={(e) => setProgressFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Progress</option>
                <option value="unread">Unread (0%)</option>
                <option value="reading">Currently Reading</option>
                <option value="completed">Completed (100%)</option>
              </select>
            </div>
          </div>

          {/* Filter Actions */}
          <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <span>Showing {filteredAndSortedBooks.length} of {books.length} books</span>
              {getActiveFiltersCount() > 0 && (
                <span className="text-blue-600">
                  {getActiveFiltersCount()} filter{getActiveFiltersCount() !== 1 ? 's' : ''} applied
                </span>
              )}
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={clearAllFilters}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Reset All
              </button>
              <button
                onClick={() => setShowFiltersPanel(false)}
                className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Selection Mode Header */}
      {isSelectionMode && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <CheckSquare className="h-5 w-5 text-blue-600" />
                <span className="text-sm font-medium text-blue-900">
                  Selection Mode
                  {selectedBooks.size > 0 && (
                    <span className="ml-2">
                      ({selectedBooks.size} book{selectedBooks.size !== 1 ? 's' : ''} selected)
                    </span>
                  )}
                </span>
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={selectAllBooks}
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  Select All ({paginatedBooks.length})
                </button>
                {selectedBooks.size > 0 && (
                  <button
                    onClick={deselectAllBooks}
                    className="text-sm text-blue-600 hover:text-blue-700"
                  >
                    Deselect All
                  </button>
                )}
              </div>
            </div>
            
            {/* Bulk Actions */}
            {selectedBooks.size > 0 && (
              <div className="flex items-center space-x-2">
                <div className="relative">
                  <button
                    onClick={() => setShowBulkMenu(!showBulkMenu)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                  >
                    <span>Actions</span>
                    <ChevronDown className="h-4 w-4" />
                  </button>
                  
                  {showBulkMenu && (
                    <>
                      <div 
                        className="fixed inset-0 z-10"
                        onClick={() => setShowBulkMenu(false)}
                      />
                      <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
                        <div className="py-1">
                          <button
                            onClick={() => handleBulkAction('download')}
                            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            <Download className="h-4 w-4 mr-3" />
                            Download Selected
                          </button>
                          <button
                            onClick={() => handleBulkAction('export')}
                            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            <Share2 className="h-4 w-4 mr-3" />
                            Export Selected
                          </button>
                          <button
                            onClick={() => handleBulkAction('archive')}
                            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            <Archive className="h-4 w-4 mr-3" />
                            Archive Selected
                          </button>
                          <div className="border-t border-gray-100">
                            <button
                              onClick={() => handleBulkAction('delete')}
                              className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4 mr-3" />
                              Delete Selected
                            </button>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
                
                <button
                  onClick={() => {
                    setIsSelectionMode(false);
                    setSelectedBooks(new Set());
                  }}
                  className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Card Size Selector (for grid view) */}
      {viewMode === 'grid' && (
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <span>Card size:</span>
            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              {['small', 'medium', 'large'].map(size => (
                <button
                  key={size}
                  onClick={() => setCardSize(size)}
                  className={`px-3 py-1 text-xs rounded-md transition-colors capitalize ${
                    cardSize === size ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
          
          <div className="text-sm text-gray-500">
            {filteredAndSortedBooks.length} book{filteredAndSortedBooks.length !== 1 ? 's' : ''}
          </div>
        </div>
      )}

      {/* Books Grid/List */}
      {filteredAndSortedBooks.length === 0 ? (
        emptyState || (
          <div className="text-center py-16">
            <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {getActiveFiltersCount() > 0 ? 'No books match your filters' : 'No books yet'}
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              {getActiveFiltersCount() > 0
                ? 'Try adjusting your search criteria or clearing some filters to see more results.'
                : 'Create your first book to get started with your digital library.'
              }
            </p>
            
            <div className="flex justify-center space-x-4">
              {getActiveFiltersCount() > 0 ? (
                <button
                  onClick={clearAllFilters}
                  className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center space-x-2"
                >
                  <RefreshCw className="h-4 w-4" />
                  <span>Clear All Filters</span>
                </button>
              ) : (
                <button
                  onClick={onCreateNew}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                >
                  <Plus className="h-4 w-4" />
                  <span>Create Your First Book</span>
                </button>
              )}
            </div>
          </div>
        )
      ) : (
        <>
          {/* Books Display */}
          <div className={getGridClasses()}>
            {paginatedBooks.map((book, index) => (
              <BookCard
                key={book.id}
                book={book}
                onView={(bookData) => handleBookSelect(bookData, index)}
                onEdit={() => onBookEdit?.(book)}
                onDelete={() => onBookDelete?.(book)}
                onDownload={() => onBookDownload?.(book)}
                onShare={() => onBookShare?.(book)}
                onRead={() => onBookRead?.(book)}
                onBookmark={onBookBookmark}
                size={cardSize}
                view={viewMode === 'grid' ? '3d' : viewMode}
                showActions={!isSelectionMode}
                showProgress={true}
                className={`transition-all duration-200 ${
                  selectedBooks.has(book.id) 
                    ? 'ring-2 ring-blue-500 bg-blue-50' 
                    : isSelectionMode 
                      ? 'hover:ring-2 hover:ring-gray-300 cursor-pointer' 
                      : ''
                }`}
              />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between mt-8 space-y-4 sm:space-y-0">
              {/* Results Info */}
              <div className="text-sm text-gray-600">
                Showing {((currentPage - 1) * itemsPerPage) + 1} to{' '}
                {Math.min(currentPage * itemsPerPage, filteredAndSortedBooks.length)} of{' '}
                {filteredAndSortedBooks.length} books
              </div>

              {/* Pagination Controls */}
              <div className="flex items-center space-x-4">
                {/* Items per page */}
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">Show:</span>
                  <select
                    value={itemsPerPage}
                    onChange={(e) => {
                      setItemsPerPage(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                    className="px-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value={6}>6 per page</option>
                    <option value={12}>12 per page</option>
                    <option value={24}>24 per page</option>
                    <option value={48}>48 per page</option>
                  </select>
                </div>

                {/* Page navigation */}
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => setCurrentPage(1)}
                    disabled={currentPage === 1}
                    className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    First
                  </button>
                  
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>

                  {/* Page numbers */}
                  {(() => {
                    const maxVisiblePages = 5;
                    const halfVisible = Math.floor(maxVisiblePages / 2);
                    let startPage = Math.max(1, currentPage - halfVisible);
                    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
                    
                    if (endPage - startPage + 1 < maxVisiblePages) {
                      startPage = Math.max(1, endPage - maxVisiblePages + 1);
                    }
                    
                    const pages = [];
                    for (let i = startPage; i <= endPage; i++) {
                      pages.push(i);
                    }
                    
                    return pages.map(pageNum => (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`px-3 py-1 border text-sm rounded transition-colors ${
                          currentPage === pageNum
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {pageNum}
                      </button>
                    ));
                  })()}

                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                  
                  <button
                    onClick={() => setCurrentPage(totalPages)}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Last
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}

    </div>
  );
};

export default BookGrid;