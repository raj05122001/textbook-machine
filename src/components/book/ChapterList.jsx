'use client';

import { useState, useEffect, useMemo } from 'react';
import { 
  FileText, 
  BookOpen, 
  Clock, 
  CheckCircle, 
  Circle, 
  AlertCircle, 
  Play, 
  Edit3, 
  Eye, 
  ChevronRight, 
  ChevronDown,
  Search,
  Filter,
  SortAsc,
  SortDesc,
  MoreHorizontal,
  Plus,
  Trash2,
  Copy,
  Move,
  Lock,
  Unlock,
  Bookmark,
  Star,
  X,
  List,
  Grid3X3,
  BarChart3,
  TrendingUp
} from 'lucide-react';

const ChapterList = ({
  chapters = [],
  currentChapterId = null,
  onChapterSelect,
  onChapterEdit,
  onChapterDelete,
  onChapterAdd,
  onChapterDuplicate,
  onChapterMove,
  onChapterToggleStatus,
  bookProgress = 0,
  showSearch = true,
  showStats = true,
  showActions = true,
  viewMode = 'list', // 'list', 'grid', 'compact'
  allowReorder = false,
  className = ''
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('order');
  const [sortOrder, setSortOrder] = useState('asc');
  const [expandedChapters, setExpandedChapters] = useState(new Set());
  const [selectedChapters, setSelectedChapters] = useState(new Set());
  const [showFilters, setShowFilters] = useState(false);
  const [draggedChapter, setDraggedChapter] = useState(null);
  const [dropTarget, setDropTarget] = useState(null);

  // Filter and sort chapters
  const filteredAndSortedChapters = useMemo(() => {
    let filtered = [...chapters];

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(chapter =>
        chapter.title.toLowerCase().includes(query) ||
        chapter.description?.toLowerCase().includes(query) ||
        chapter.content?.toLowerCase().includes(query)
      );
    }

    // Apply status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter(chapter => chapter.status === filterStatus);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue, bValue;

      switch (sortBy) {
        case 'title':
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
          break;
        case 'wordCount':
          aValue = a.wordCount || 0;
          bValue = b.wordCount || 0;
          break;
        case 'status':
          aValue = a.status || 'draft';
          bValue = b.status || 'draft';
          break;
        case 'lastModified':
          aValue = new Date(a.lastModified || a.createdAt || 0);
          bValue = new Date(b.lastModified || b.createdAt || 0);
          break;
        case 'readingTime':
          aValue = Math.ceil((a.wordCount || 0) / 200);
          bValue = Math.ceil((b.wordCount || 0) / 200);
          break;
        default:
          aValue = a.order || 0;
          bValue = b.order || 0;
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
  }, [chapters, searchQuery, filterStatus, sortBy, sortOrder]);

  // Chapter statistics
  const chapterStats = useMemo(() => {
    const totalWords = chapters.reduce((sum, chapter) => sum + (chapter.wordCount || 0), 0);
    const completedChapters = chapters.filter(chapter => chapter.status === 'completed').length;
    const inProgressChapters = chapters.filter(chapter => chapter.status === 'in-progress').length;
    const draftChapters = chapters.filter(chapter => chapter.status === 'draft').length;
    const averageWordsPerChapter = totalWords / chapters.length || 0;
    const estimatedReadingTime = Math.ceil(totalWords / 200); // 200 words per minute

    return {
      total: chapters.length,
      totalWords,
      completed: completedChapters,
      inProgress: inProgressChapters,
      draft: draftChapters,
      averageWords: averageWordsPerChapter,
      estimatedReadingTime,
      completionPercentage: chapters.length > 0 ? (completedChapters / chapters.length) * 100 : 0
    };
  }, [chapters]);

  // Status configurations
  const statusConfig = {
    draft: { 
      icon: Circle, 
      color: 'text-gray-400', 
      bgColor: 'bg-gray-100', 
      label: 'Draft' 
    },
    'in-progress': { 
      icon: AlertCircle, 
      color: 'text-blue-500', 
      bgColor: 'bg-blue-100', 
      label: 'In Progress' 
    },
    review: { 
      icon: Eye, 
      color: 'text-orange-500', 
      bgColor: 'bg-orange-100', 
      label: 'Review' 
    },
    completed: { 
      icon: CheckCircle, 
      color: 'text-green-500', 
      bgColor: 'bg-green-100', 
      label: 'Completed' 
    }
  };

  const getStatusIcon = (status) => {
    const config = statusConfig[status] || statusConfig.draft;
    const Icon = config.icon;
    return <Icon className={`h-4 w-4 ${config.color}`} />;
  };

  const getStatusBadge = (status) => {
    const config = statusConfig[status] || statusConfig.draft;
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.bgColor} ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const formatReadingTime = (wordCount) => {
    const minutes = Math.ceil((wordCount || 0) / 200);
    if (minutes < 60) {
      return `${minutes}m`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Drag and drop handlers
  const handleDragStart = (e, chapter) => {
    if (!allowReorder) return;
    setDraggedChapter(chapter);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, targetChapter) => {
    if (!allowReorder || !draggedChapter) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDropTarget(targetChapter.id);
  };

  const handleDrop = (e, targetChapter) => {
    if (!allowReorder || !draggedChapter || draggedChapter.id === targetChapter.id) return;
    e.preventDefault();
    
    onChapterMove?.(draggedChapter.id, targetChapter.id);
    setDraggedChapter(null);
    setDropTarget(null);
  };

  const handleDragEnd = () => {
    setDraggedChapter(null);
    setDropTarget(null);
  };

  const toggleExpanded = (chapterId) => {
    const newExpanded = new Set(expandedChapters);
    if (newExpanded.has(chapterId)) {
      newExpanded.delete(chapterId);
    } else {
      newExpanded.add(chapterId);
    }
    setExpandedChapters(newExpanded);
  };

  const renderChapterListItem = (chapter, index) => {
    const isSelected = currentChapterId === chapter.id;
    const isExpanded = expandedChapters.has(chapter.id);
    const isDragging = draggedChapter?.id === chapter.id;
    const isDropTarget = dropTarget === chapter.id;

    return (
      <div
        key={chapter.id}
        className={`border border-gray-200 rounded-lg transition-all duration-200 ${
          isSelected ? 'ring-2 ring-blue-500 bg-blue-50' : 'bg-white hover:shadow-md'
        } ${isDragging ? 'opacity-50' : ''} ${isDropTarget ? 'ring-2 ring-green-400' : ''}`}
        draggable={allowReorder}
        onDragStart={(e) => handleDragStart(e, chapter)}
        onDragOver={(e) => handleDragOver(e, chapter)}
        onDrop={(e) => handleDrop(e, chapter)}
        onDragEnd={handleDragEnd}
      >
        {/* Main Chapter Row */}
        <div 
          className="p-4 cursor-pointer"
          onClick={() => onChapterSelect?.(chapter)}
        >
          <div className="flex items-center justify-between">
            {/* Left Side - Chapter Info */}
            <div className="flex items-center space-x-4 flex-1 min-w-0">
              {/* Order Number */}
              <div className="flex-shrink-0 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-sm font-medium text-gray-600">
                {index + 1}
              </div>

              {/* Chapter Details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <h3 className="text-lg font-semibold text-gray-900 truncate">
                    {chapter.title}
                  </h3>
                  {chapter.isBookmarked && (
                    <Bookmark className="h-4 w-4 text-yellow-500 fill-current" />
                  )}
                  {chapter.isLocked && (
                    <Lock className="h-4 w-4 text-gray-400" />
                  )}
                </div>
                
                {chapter.description && (
                  <p className="text-gray-600 text-sm line-clamp-2 mb-2">
                    {chapter.description}
                  </p>
                )}
                
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <FileText className="h-3 w-3" />
                    <span>{(chapter.wordCount || 0).toLocaleString()} words</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="h-3 w-3" />
                    <span>{formatReadingTime(chapter.wordCount)}</span>
                  </div>
                  {chapter.lastModified && (
                    <span>Modified {formatDate(chapter.lastModified)}</span>
                  )}
                </div>
              </div>
            </div>

            {/* Right Side - Status and Actions */}
            <div className="flex items-center space-x-3">
              {/* Status */}
              <div className="flex items-center space-x-2">
                {getStatusIcon(chapter.status)}
                {getStatusBadge(chapter.status)}
              </div>

              {/* Progress Bar */}
              {chapter.progress !== undefined && (
                <div className="w-16">
                  <div className="text-xs text-gray-500 mb-1">{chapter.progress}%</div>
                  <div className="w-full bg-gray-200 rounded-full h-1">
                    <div
                      className="bg-blue-500 h-1 rounded-full transition-all"
                      style={{ width: `${chapter.progress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Expand/Collapse */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleExpanded(chapter.id);
                }}
                className="p-1 text-gray-400 hover:text-gray-600 rounded"
              >
                {isExpanded ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </button>

              {/* Actions Menu */}
              {showActions && (
                <div className="relative">
                  <button
                    onClick={(e) => e.stopPropagation()}
                    className="p-1 text-gray-400 hover:text-gray-600 rounded"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Expanded Details */}
        {isExpanded && (
          <div className="border-t border-gray-100 p-4 bg-gray-50">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Content Preview */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-2">Content Preview</h4>
                <p className="text-sm text-gray-600 line-clamp-3">
                  {chapter.content ? 
                    chapter.content.substring(0, 200) + (chapter.content.length > 200 ? '...' : '') :
                    'No content available'
                  }
                </p>
              </div>

              {/* Chapter Statistics */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-2">Statistics</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-gray-500">Characters:</span>
                    <span className="ml-1 font-medium">{(chapter.content?.length || 0).toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Paragraphs:</span>
                    <span className="ml-1 font-medium">
                      {chapter.content ? chapter.content.split('\n\n').length : 0}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500">Created:</span>
                    <span className="ml-1 font-medium">{formatDate(chapter.createdAt)}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Pages:</span>
                    <span className="ml-1 font-medium">{Math.ceil((chapter.wordCount || 0) / 250)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-2 mt-4">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onChapterSelect?.(chapter);
                }}
                className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors flex items-center space-x-1"
              >
                <Play className="h-3 w-3" />
                <span>Read</span>
              </button>
              
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onChapterEdit?.(chapter);
                }}
                className="px-3 py-1 bg-gray-600 text-white rounded text-sm hover:bg-gray-700 transition-colors flex items-center space-x-1"
              >
                <Edit3 className="h-3 w-3" />
                <span>Edit</span>
              </button>
              
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onChapterToggleStatus?.(chapter.id, 
                    chapter.status === 'completed' ? 'draft' : 'completed'
                  );
                }}
                className={`px-3 py-1 rounded text-sm transition-colors flex items-center space-x-1 ${
                  chapter.status === 'completed' 
                    ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {chapter.status === 'completed' ? (
                  <>
                    <CheckCircle className="h-3 w-3" />
                    <span>Completed</span>
                  </>
                ) : (
                  <>
                    <Circle className="h-3 w-3" />
                    <span>Mark Complete</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderChapterGridItem = (chapter, index) => {
    const isSelected = currentChapterId === chapter.id;

    return (
      <div
        key={chapter.id}
        className={`border border-gray-200 rounded-lg p-4 cursor-pointer transition-all duration-200 ${
          isSelected ? 'ring-2 ring-blue-500 bg-blue-50' : 'bg-white hover:shadow-md'
        }`}
        onClick={() => onChapterSelect?.(chapter)}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-xs font-medium text-blue-600">
              {index + 1}
            </div>
            {getStatusIcon(chapter.status)}
          </div>
          {showActions && (
            <button className="p-1 text-gray-400 hover:text-gray-600 rounded">
              <MoreHorizontal className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Title */}
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
          {chapter.title}
        </h3>

        {/* Description */}
        {chapter.description && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {chapter.description}
          </p>
        )}

        {/* Stats */}
        <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
          <div className="flex items-center space-x-1">
            <FileText className="h-3 w-3" />
            <span>{(chapter.wordCount || 0).toLocaleString()}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Clock className="h-3 w-3" />
            <span>{formatReadingTime(chapter.wordCount)}</span>
          </div>
        </div>

        {/* Progress */}
        {chapter.progress !== undefined && (
          <div className="mb-3">
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>Progress</span>
              <span>{chapter.progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1">
              <div
                className="bg-blue-500 h-1 rounded-full transition-all"
                style={{ width: `${chapter.progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Status Badge */}
        <div className="flex justify-between items-center">
          {getStatusBadge(chapter.status)}
          <span className="text-xs text-gray-400">
            {formatDate(chapter.lastModified)}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 ${className}`}>
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">
            Chapters ({filteredAndSortedChapters.length})
          </h2>
          
          {showActions && (
            <button
              onClick={() => onChapterAdd?.()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Add Chapter</span>
            </button>
          )}
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          {/* Search and Filters */}
          <div className="flex items-center space-x-2">
            {showSearch && (
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search chapters..."
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
            )}

            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`p-2 rounded-lg transition-colors ${
                showFilters ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Filter className="h-4 w-4" />
            </button>
          </div>

          {/* View Mode and Sort */}
          <div className="flex items-center space-x-2">
            {/* View Mode Toggle */}
            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'list' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <List className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'grid' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Grid3X3 className="h-4 w-4" />
              </button>
            </div>

            {/* Sort Controls */}
            <div className="flex items-center">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-l-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="order">Order</option>
                <option value="title">Title</option>
                <option value="wordCount">Word Count</option>
                <option value="status">Status</option>
                <option value="lastModified">Last Modified</option>
                <option value="readingTime">Reading Time</option>
              </select>
              <button
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="px-3 py-2 border border-l-0 border-gray-300 rounded-r-lg hover:bg-gray-50 transition-colors"
              >
                {sortOrder === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
              </button>
            </div>
          </div>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Status</option>
                  <option value="draft">Draft</option>
                  <option value="in-progress">In Progress</option>
                  <option value="review">Review</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Statistics */}
      {showStats && (
        <div className="p-6 border-b border-gray-200 bg-gray-50">
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
            <div className="text-center">
              <div className="text-lg font-bold text-gray-900">{chapterStats.total}</div>
              <div className="text-sm text-gray-600">Total</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-green-600">{chapterStats.completed}</div>
              <div className="text-sm text-gray-600">Completed</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-blue-600">{chapterStats.inProgress}</div>
              <div className="text-sm text-gray-600">In Progress</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-yellow-600">{chapterStats.draft}</div>
              <div className="text-sm text-gray-600">Draft</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-purple-600">{chapterStats.totalWords.toLocaleString()}</div>
              <div className="text-sm text-gray-600">Total Words</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-orange-600">{chapterStats.estimatedReadingTime}h</div>
              <div className="text-sm text-gray-600">Reading Time</div>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-4">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Completion Progress</span>
              <span>{Math.round(chapterStats.completionPercentage)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-500 h-2 rounded-full transition-all"
                style={{ width: `${chapterStats.completionPercentage}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Chapters List/Grid */}
      <div className="p-6">
        {filteredAndSortedChapters.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchQuery || filterStatus !== 'all' ? 'No chapters found' : 'No chapters yet'}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchQuery || filterStatus !== 'all'
                ? 'Try adjusting your search or filters'
                : 'Start writing your first chapter'
              }
            </p>
            {(!searchQuery && filterStatus === 'all') && showActions && (
              <button
                onClick={() => onChapterAdd?.()}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add First Chapter
              </button>
            )}
          </div>
        ) : (
          <div className={
            viewMode === 'grid' 
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'
              : 'space-y-4'
          }>
            {filteredAndSortedChapters.map((chapter, index) => 
              viewMode === 'grid' 
                ? renderChapterGridItem(chapter, index)
                : renderChapterListItem(chapter, index)
            )}
          </div>
        )}
      </div>

      {/* CSS for animations and styling */}
      <style jsx>{`
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default ChapterList;