'use client';

import { useState, useRef, useEffect } from 'react';
import { 
  ChevronRight, 
  ChevronDown, 
  FileText, 
  Plus, 
  Trash2, 
  Edit3, 
  Move, 
  Copy,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  MoreHorizontal,
  GripVertical,
  Folder,
  FolderOpen,
  BookOpen,
  Clock,
  CheckCircle,
  AlertCircle,
  Circle,
  Search,
  Filter,
  SortAsc,
  SortDesc,
  RotateCcw,
  Save,
  X
} from 'lucide-react';

const OutlineTree = ({ 
  chapters = [], 
  selectedChapterId, 
  onChapterSelect, 
  onChapterUpdate, 
  onChapterAdd, 
  onChapterDelete, 
  onChapterMove,
  onChapterDuplicate,
  readOnly = false,
  showSearch = true,
  showFilter = true,
  showStats = true,
  className = ''
}) => {
  const [expandedChapters, setExpandedChapters] = useState(new Set(['root']));
  const [editingChapter, setEditingChapter] = useState(null);
  const [draggedChapter, setDraggedChapter] = useState(null);
  const [dropTarget, setDropTarget] = useState(null);
  const [dropPosition, setDropPosition] = useState('middle'); // 'above', 'middle', 'below'
  const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0, chapterId: null });
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('order'); // 'order', 'title', 'wordCount', 'status', 'lastModified'
  const [sortDirection, setSortDirection] = useState('asc');
  const [showFilters, setShowFilters] = useState(false);
  
  const editInputRef = useRef(null);
  const searchInputRef = useRef(null);

  // Enhanced chapter structure with hierarchy support
  const [chapterHierarchy, setChapterHierarchy] = useState(() => {
    return buildHierarchy(chapters);
  });

  // Build hierarchical structure from flat chapter array
  function buildHierarchy(chapters) {
    const chapterMap = new Map();
    const rootChapters = [];

    // Create a map of all chapters
    chapters.forEach(chapter => {
      chapterMap.set(chapter.id, { ...chapter, children: [] });
    });

    // Build hierarchy
    chapters.forEach(chapter => {
      if (chapter.parentId) {
        const parent = chapterMap.get(chapter.parentId);
        if (parent) {
          parent.children.push(chapterMap.get(chapter.id));
        }
      } else {
        rootChapters.push(chapterMap.get(chapter.id));
      }
    });

    return rootChapters;
  }

  // Update hierarchy when chapters change
  useEffect(() => {
    setChapterHierarchy(buildHierarchy(chapters));
  }, [chapters]);

  // Filter and sort chapters
  const filteredAndSortedChapters = (chapterList) => {
    let filtered = chapterList;

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(chapter =>
        chapter.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        chapter.description?.toLowerCase().includes(searchQuery.toLowerCase())
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
        default:
          aValue = a.order || 0;
          bValue = b.order || 0;
      }

      if (sortDirection === 'desc') {
        [aValue, bValue] = [bValue, aValue];
      }

      if (typeof aValue === 'string') {
        return aValue.localeCompare(bValue);
      }
      return aValue - bValue;
    });

    return filtered;
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

  const startEditing = (chapterId) => {
    setEditingChapter(chapterId);
    setTimeout(() => {
      editInputRef.current?.focus();
      editInputRef.current?.select();
    }, 0);
  };

  const handleEdit = (chapterId, newTitle) => {
    if (newTitle.trim()) {
      onChapterUpdate?.(chapterId, { 
        title: newTitle.trim(),
        lastModified: new Date().toISOString()
      });
    }
    setEditingChapter(null);
  };

  const handleKeyPress = (e, chapterId, title) => {
    if (e.key === 'Enter') {
      handleEdit(chapterId, title);
    } else if (e.key === 'Escape') {
      setEditingChapter(null);
    }
  };

  const handleContextMenu = (e, chapterId) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({
      visible: true,
      x: e.clientX,
      y: e.clientY,
      chapterId
    });
  };

  const closeContextMenu = () => {
    setContextMenu({ visible: false, x: 0, y: 0, chapterId: null });
  };

  // Enhanced Drag and Drop handlers
  const handleDragStart = (e, chapterId) => {
    if (readOnly) return;
    setDraggedChapter(chapterId);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', chapterId);
    
    // Add visual feedback
    setTimeout(() => {
      const draggedElement = document.querySelector(`[data-chapter-id="${chapterId}"]`);
      if (draggedElement) {
        draggedElement.style.opacity = '0.5';
      }
    }, 0);
  };

  const handleDragOver = (e, chapterId) => {
    if (readOnly || !draggedChapter || draggedChapter === chapterId) return;
    
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    
    // Determine drop position based on mouse position
    const rect = e.currentTarget.getBoundingClientRect();
    const y = e.clientY - rect.top;
    const height = rect.height;
    
    if (y < height * 0.25) {
      setDropPosition('above');
    } else if (y > height * 0.75) {
      setDropPosition('below');
    } else {
      setDropPosition('middle');
    }
    
    setDropTarget(chapterId);
  };

  const handleDragLeave = (e) => {
    // Only clear if leaving the entire tree area
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setDropTarget(null);
      setDropPosition('middle');
    }
  };

  const handleDrop = (e, targetChapterId) => {
    if (readOnly || !draggedChapter || draggedChapter === targetChapterId) return;
    e.preventDefault();
    
    const moveData = {
      sourceId: draggedChapter,
      targetId: targetChapterId,
      position: dropPosition // 'above', 'middle' (as child), 'below'
    };
    
    onChapterMove?.(moveData);
    handleDragEnd();
  };

  const handleDragEnd = () => {
    // Reset drag state
    if (draggedChapter) {
      const draggedElement = document.querySelector(`[data-chapter-id="${draggedChapter}"]`);
      if (draggedElement) {
        draggedElement.style.opacity = '';
      }
    }
    
    setDraggedChapter(null);
    setDropTarget(null);
    setDropPosition('middle');
  };

  const getChapterIcon = (chapter) => {
    if (chapter.children && chapter.children.length > 0) {
      return expandedChapters.has(chapter.id) ? (
        <FolderOpen className="h-4 w-4 text-blue-500" />
      ) : (
        <Folder className="h-4 w-4 text-blue-500" />
      );
    }
    
    switch (chapter.type) {
      case 'section':
        return <BookOpen className="h-4 w-4 text-purple-500" />;
      case 'appendix':
        return <FileText className="h-4 w-4 text-gray-500" />;
      default:
        return <FileText className="h-4 w-4 text-blue-500" />;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'complete':
        return <CheckCircle className="h-3 w-3 text-green-500" />;
      case 'review':
        return <AlertCircle className="h-3 w-3 text-orange-500" />;
      case 'draft':
        return <Circle className="h-3 w-3 text-gray-400" />;
      default:
        return <Circle className="h-3 w-3 text-gray-300" />;
    }
  };

  const getChapterStats = (chapter) => {
    const wordCount = chapter.wordCount || 0;
    const pageCount = Math.ceil(wordCount / 250); // ~250 words per page
    const readingTime = Math.ceil(wordCount / 200); // ~200 words per minute
    
    return { wordCount, pageCount, readingTime };
  };

  const getTotalStats = (chapterList) => {
    const stats = chapterList.reduce((acc, chapter) => {
      const chapterStats = getChapterStats(chapter);
      acc.totalWords += chapterStats.wordCount;
      acc.totalPages += chapterStats.pageCount;
      acc.totalReadingTime += chapterStats.readingTime;
      acc.totalChapters += 1;
      
      if (chapter.children) {
        const childStats = getTotalStats(chapter.children);
        acc.totalWords += childStats.totalWords;
        acc.totalPages += childStats.totalPages;
        acc.totalReadingTime += childStats.totalReadingTime;
        acc.totalChapters += childStats.totalChapters;
      }
      
      return acc;
    }, { totalWords: 0, totalPages: 0, totalReadingTime: 0, totalChapters: 0 });
    
    return stats;
  };

  const renderChapter = (chapter, level = 0) => {
    const isExpanded = expandedChapters.has(chapter.id);
    const isSelected = selectedChapterId === chapter.id;
    const isEditing = editingChapter === chapter.id;
    const isDragging = draggedChapter === chapter.id;
    const isDropTarget = dropTarget === chapter.id;
    const hasChildren = chapter.children && chapter.children.length > 0;
    const stats = getChapterStats(chapter);

    // Apply filters
    const filteredChildren = hasChildren ? 
      filteredAndSortedChapters(chapter.children) : [];

    const dropIndicatorClass = isDropTarget ? {
      'above': 'border-t-2 border-blue-500',
      'below': 'border-b-2 border-blue-500',
      'middle': 'bg-blue-50 border-2 border-blue-300 border-dashed'
    }[dropPosition] : '';

    return (
      <div key={chapter.id} className="select-none">
        {/* Drop indicator above */}
        {isDropTarget && dropPosition === 'above' && (
          <div className="h-0.5 bg-blue-500 mx-2 rounded" />
        )}

        {/* Chapter Item */}
        <div
          data-chapter-id={chapter.id}
          className={`
            flex items-center group relative px-2 py-2 rounded-lg cursor-pointer transition-all
            ${isSelected ? 'bg-blue-100 border-l-4 border-blue-500' : 'hover:bg-gray-50'}
            ${isDragging ? 'opacity-50 scale-95 rotate-1' : ''}
            ${dropIndicatorClass}
            ${level > 0 ? `ml-${Math.min(level * 4, 16)}` : ''}
          `}
          style={{ 
            paddingLeft: `${level * 16 + 8}px`,
            transition: 'all 0.2s ease'
          }}
          onClick={() => !isEditing && onChapterSelect?.(chapter.id)}
          onContextMenu={(e) => handleContextMenu(e, chapter.id)}
          draggable={!readOnly && !isEditing}
          onDragStart={(e) => handleDragStart(e, chapter.id)}
          onDragOver={(e) => handleDragOver(e, chapter.id)}
          onDragLeave={handleDragLeave}
          onDrop={(e) => handleDrop(e, chapter.id)}
          onDragEnd={handleDragEnd}
        >
          {/* Drag Handle */}
          {!readOnly && (
            <div className="opacity-0 group-hover:opacity-100 transition-opacity mr-2 cursor-grab active:cursor-grabbing">
              <GripVertical className="h-4 w-4 text-gray-400" />
            </div>
          )}

          {/* Expand/Collapse Button */}
          {hasChildren && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleExpanded(chapter.id);
              }}
              className="mr-2 p-1 hover:bg-gray-200 rounded transition-colors"
            >
              {isExpanded ? (
                <ChevronDown className="h-4 w-4 text-gray-600" />
              ) : (
                <ChevronRight className="h-4 w-4 text-gray-600" />
              )}
            </button>
          )}

          {/* Chapter Icon */}
          <div className="mr-3 flex-shrink-0">
            {getChapterIcon(chapter)}
          </div>

          {/* Chapter Title and Description */}
          <div className="flex-1 min-w-0">
            {isEditing ? (
              <input
                ref={editInputRef}
                type="text"
                defaultValue={chapter.title}
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                onBlur={(e) => handleEdit(chapter.id, e.target.value)}
                onKeyPress={(e) => handleKeyPress(e, chapter.id, e.target.value)}
                onClick={(e) => e.stopPropagation()}
                autoFocus
              />
            ) : (
              <div className="truncate">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-900 truncate">
                    {chapter.title}
                  </span>
                  {chapter.isLocked && <Lock className="h-3 w-3 text-gray-400 flex-shrink-0" />}
                  {chapter.isVisible === false && <EyeOff className="h-3 w-3 text-gray-400 flex-shrink-0" />}
                </div>
                {chapter.description && (
                  <div className="text-xs text-gray-500 truncate mt-0.5">
                    {chapter.description}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Chapter Stats */}
          <div className="flex items-center space-x-3 text-xs text-gray-500 mr-2">
            <span title={`${stats.wordCount} words`}>
              {stats.wordCount > 1000 ? `${(stats.wordCount / 1000).toFixed(1)}k` : stats.wordCount}w
            </span>
            <span title={`${stats.pageCount} pages`}>
              {stats.pageCount}p
            </span>
            
            {/* Status Indicator */}
            <div className="flex items-center space-x-1" title={`Status: ${chapter.status || 'draft'}`}>
              {getStatusIcon(chapter.status)}
            </div>
          </div>

          {/* Last Modified */}
          {chapter.lastModified && (
            <div className="text-xs text-gray-400 mr-2" title="Last modified">
              <Clock className="h-3 w-3 inline mr-1" />
              {new Date(chapter.lastModified).toLocaleDateString()}
            </div>
          )}

          {/* Actions Menu */}
          {!readOnly && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleContextMenu(e, chapter.id);
              }}
              className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-200 rounded transition-all"
            >
              <MoreHorizontal className="h-4 w-4 text-gray-400" />
            </button>
          )}
        </div>

        {/* Drop indicator below */}
        {isDropTarget && dropPosition === 'below' && (
          <div className="h-0.5 bg-blue-500 mx-2 rounded" />
        )}

        {/* Children */}
        {hasChildren && isExpanded && (
          <div className="mt-1">
            {filteredChildren.map(child => renderChapter(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  const stats = getTotalStats(chapterHierarchy);

  return (
    <div className={`h-full flex flex-col bg-white border-r border-gray-200 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
        <h3 className="text-lg font-semibold text-gray-900">Book Outline</h3>
        <div className="flex items-center space-x-2">
          {showFilter && (
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`p-2 rounded-lg transition-colors ${
                showFilters ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'
              }`}
              title="Filters"
            >
              <Filter className="h-4 w-4" />
            </button>
          )}
          {!readOnly && (
            <button
              onClick={() => onChapterAdd?.()}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="Add Chapter"
            >
              <Plus className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Search and Filters */}
      {(showSearch || showFilter) && (
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          {showSearch && (
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search chapters..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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

          {showFilters && (
            <div className="grid grid-cols-2 gap-2">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                <option value="draft">Draft</option>
                <option value="review">Review</option>
                <option value="complete">Complete</option>
              </select>

              <div className="flex items-center border border-gray-300 rounded-lg">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="flex-1 px-3 py-2 text-sm focus:outline-none border-none rounded-l-lg"
                >
                  <option value="order">Order</option>
                  <option value="title">Title</option>
                  <option value="wordCount">Word Count</option>
                  <option value="status">Status</option>
                  <option value="lastModified">Modified</option>
                </select>
                <button
                  onClick={() => setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}
                  className="px-2 py-2 border-l border-gray-300 hover:bg-gray-50"
                >
                  {sortDirection === 'asc' ? 
                    <SortAsc className="h-4 w-4 text-gray-600" /> : 
                    <SortDesc className="h-4 w-4 text-gray-600" />
                  }
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tree Content */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {chapterHierarchy.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-500 mb-2">No chapters yet</h4>
            <p className="text-gray-400 text-sm mb-4">Start building your book structure</p>
            {!readOnly && (
              <button
                onClick={() => onChapterAdd?.()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add First Chapter
              </button>
            )}
          </div>
        ) : (
          filteredAndSortedChapters(chapterHierarchy).map(chapter => renderChapter(chapter))
        )}
      </div>

      {/* Context Menu */}
      {contextMenu.visible && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={closeContextMenu}
          />
          <div
            className="fixed z-50 bg-white rounded-lg shadow-lg border border-gray-200 py-1 min-w-48"
            style={{ left: contextMenu.x, top: contextMenu.y }}
          >
            <button
              onClick={() => {
                startEditing(contextMenu.chapterId);
                closeContextMenu();
              }}
              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              <Edit3 className="h-4 w-4 mr-3" />
              Rename
            </button>
            
            <button
              onClick={() => {
                onChapterAdd?.(contextMenu.chapterId);
                closeContextMenu();
              }}
              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              <Plus className="h-4 w-4 mr-3" />
              Add Subchapter
            </button>
            
            <button
              onClick={() => {
                onChapterDuplicate?.(contextMenu.chapterId);
                closeContextMenu();
              }}
              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              <Copy className="h-4 w-4 mr-3" />
              Duplicate
            </button>
            
            <div className="border-t border-gray-100 my-1" />
            
            <button
              onClick={() => {
                const chapter = chapters.find(c => c.id === contextMenu.chapterId);
                onChapterUpdate?.(contextMenu.chapterId, { 
                  isVisible: !chapter?.isVisible 
                });
                closeContextMenu();
              }}
              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              {chapters.find(c => c.id === contextMenu.chapterId)?.isVisible === false ? (
                <>
                  <Eye className="h-4 w-4 mr-3" />
                  Show Chapter
                </>
              ) : (
                <>
                  <EyeOff className="h-4 w-4 mr-3" />
                  Hide Chapter
                </>
              )}
            </button>
            
            <button
              onClick={() => {
                const chapter = chapters.find(c => c.id === contextMenu.chapterId);
                onChapterUpdate?.(contextMenu.chapterId, { 
                  isLocked: !chapter?.isLocked 
                });
                closeContextMenu();
              }}
              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              {chapters.find(c => c.id === contextMenu.chapterId)?.isLocked ? (
                <>
                  <Unlock className="h-4 w-4 mr-3" />
                  Unlock Chapter
                </>
              ) : (
                <>
                  <Lock className="h-4 w-4 mr-3" />
                  Lock Chapter
                </>
              )}
            </button>
            
            <div className="border-t border-gray-100 my-1" />
            
            <button
              onClick={() => {
                onChapterDelete?.(contextMenu.chapterId);
                closeContextMenu();
              }}
              className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4 mr-3" />
              Delete Chapter
            </button>
          </div>
        </>
      )}

      {/* Summary Stats */}
      {showStats && (
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="text-xs text-gray-600 space-y-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex justify-between">
                <span>Total Chapters:</span>
                <span className="font-medium">{stats.totalChapters}</span>
              </div>
              <div className="flex justify-between">
                <span>Total Words:</span>
                <span className="font-medium">{stats.totalWords.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Est. Pages:</span>
                <span className="font-medium">{stats.totalPages}</span>
              </div>
              <div className="flex justify-between">
                <span>Reading Time:</span>
                <span className="font-medium">{stats.totalReadingTime}m</span>
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="mt-3">
              <div className="flex justify-between text-xs mb-1">
                <span>Completion</span>
                <span>{Math.round((chapters.filter(c => c.status === 'complete').length / chapters.length) * 100) || 0}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full transition-all duration-300"
                  style={{ 
                    width: `${(chapters.filter(c => c.status === 'complete').length / chapters.length) * 100 || 0}%` 
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OutlineTree;